"""Download original creator videos, preserve streams, and select posters for BeatAPI storage.

Never downloads aggregator remakes. Outputs a resumable content-addressed manifest;
publication uses the site's scripts/upload-qwen4-media.mjs.
"""
import argparse, concurrent.futures, hashlib, json, shutil, subprocess
from pathlib import Path
from PIL import Image, ImageFilter, ImageStat


def probe(file):
    return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(file)]))


def sha(file):
    h=hashlib.sha256()
    with file.open('rb') as f:
        for chunk in iter(lambda:f.read(1024*1024),b''):h.update(chunk)
    return h.hexdigest()


def prepare(job,root):
    item, index, video=job
    folder=root/item['id']/str(index);folder.mkdir(parents=True,exist_ok=True)
    manifest=folder/'media.json'
    if manifest.exists():return json.loads(manifest.read_text())
    original=folder/'original.mp4';target=folder/'video.mp4'
    url=video.get('sourceUrl',video['url'])
    if not original.exists():
        subprocess.run(['curl','--fail','--location','--silent','--show-error','--retry','4','--retry-all-errors','--connect-timeout','20','--max-time','300','--output',str(original)+'.part',url],check=True)
        Path(str(original)+'.part').rename(original)
    before=probe(original)
    if not target.exists():
        subprocess.run(['ffmpeg','-nostdin','-hide_banner','-loglevel','error','-y','-i',str(original),'-map','0:v:0','-map','0:a?','-c','copy','-movflags','+faststart',str(target)],check=True)
    after=probe(target)
    duration=float(after['format']['duration'])
    assert abs(float(before['format']['duration'])-duration)<0.1
    assert [s['codec_name'] for s in before['streams'] if s['codec_type'] in ('video','audio')]==[s['codec_name'] for s in after['streams'] if s['codec_type'] in ('video','audio')]
    candidates=[]
    for i,ts in enumerate([min(.5,duration/2),duration*.15,duration*.35,duration*.55,duration*.75]):
        frame=folder/f'frame-{i}.jpg'
        if not frame.exists():subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-ss',str(ts),'-i',str(target),'-frames:v','1','-vf',"scale='min(960,iw)':-2",'-q:v','2',str(frame)],check=True)
        with Image.open(frame) as im:
            gray=im.convert('L');stats=ImageStat.Stat(gray);brightness=stats.mean[0];contrast=stats.stddev[0];sharpness=ImageStat.Stat(gray.filter(ImageFilter.FIND_EDGES)).stddev[0]
            score=gray.entropy()*10+contrast+sharpness*.75-abs(brightness-128)*.12
            candidates.append(dict(file=str(frame),time=ts,score=score,acceptable=12<=brightness<=243 and contrast>=10 and sharpness>=1))
    selected=max([c for c in candidates if c['acceptable']] or candidates,key=lambda c:c['score'])
    poster=folder/'poster.jpg';shutil.copyfile(selected['file'],poster)
    video_sha=sha(target);poster_sha=sha(poster);prefix=f"prompt-gallery/qwen4/{item['id']}"
    result=dict(id=item['id'],index=index,mediaKey=video['mediaKey'],sourceUrl=url,originalPostUrl=item['originalPostUrl'],
        originalSha256=sha(original),videoFile=str(target),videoSha256=video_sha,videoBytes=target.stat().st_size,
        posterFile=str(poster),posterSha256=poster_sha,posterBytes=poster.stat().st_size,
        videoUrl=f'https://cdn.beatapi.io/{prefix}/video-{video_sha[:12]}.mp4',
        posterUrl=f'https://cdn.beatapi.io/{prefix}/poster-{poster_sha[:12]}.jpg',
        durationSeconds=duration,posterTime=selected['time'],posterNeedsReview=not selected['acceptable'],
        hasAudio=any(s['codec_type']=='audio' for s in after['streams']))
    manifest.write_text(json.dumps(result,indent=2)+'\n')
    return result


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--output-dir',type=Path,required=True);parser.add_argument('--workers',type=int,default=6);args=parser.parse_args()
    root=Path(__file__).resolve().parent.parent
    catalog=json.loads((root/'cases/catalog.json').read_text())
    jobs=[(c,i,v) for c in catalog['cases'] for i,v in enumerate(c['videos'])]
    args.output_dir.mkdir(parents=True,exist_ok=True);results=[];failed=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as ex:
        tasks={ex.submit(prepare,j,args.output_dir):j for j in jobs}
        for future in concurrent.futures.as_completed(tasks):
            job=tasks[future]
            try:results.append(future.result());print(f'prepared {len(results)}/{len(jobs)} {job[0]["id"]}',flush=True)
            except Exception as e:failed.append({'id':job[0]['id'],'index':job[1],'error':str(e)});print('FAILED',job[0]['id'],type(e).__name__,flush=True)
            (args.output_dir/'manifest.json').write_text(json.dumps(sorted(results,key=lambda r:(r['id'],r['index'])),indent=2)+'\n')
    (args.output_dir/'failures.json').write_text(json.dumps(failed,indent=2)+'\n')
    print(json.dumps({'prepared':len(results),'failed':len(failed),'bytes':sum(x['videoBytes']+x['posterBytes'] for x in results)}),flush=True)
    if failed:raise SystemExit(1)

if __name__=='__main__':main()
