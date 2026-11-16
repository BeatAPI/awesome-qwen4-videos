// [INPUT]: Reviewed creator cases and original prompts in cases/.
// [OUTPUT]: Bilingual README, complete case pages and an owned-link validation gate.
// [POS]: Deterministic repository publishing pipeline; never fetches or invents media.
// [PROTOCOL]: Update cases, verify original sources, sync the website, then run npm test.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const root=new URL('../',import.meta.url);
const {cases}=JSON.parse(readFileSync(new URL('cases/catalog.json',root),'utf8'));
const prompts=JSON.parse(readFileSync(new URL('cases/prompts.json',root),'utf8'));
const check=process.argv.includes('--check');
const changed=[];
const escape=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function owned(path,zh=false){const url=new URL(`${zh?'/zh':''}${path}`,'https://beatapi.io');url.searchParams.set('utm_source','github');url.searchParams.set('utm_medium','gallery');url.searchParams.set('utm_campaign','awesome-qwen4-videos');return url.href;}
function emit(path,body){const dest=new URL(path,root);let prior='';try{prior=readFileSync(dest,'utf8');}catch{}if(prior!==body){changed.push(path);if(!check)writeFileSync(dest,body);}}
assert.equal(new Set(cases.map(x=>x.id)).size,cases.length);
const featured=cases.filter(x=>x.featured);
assert.equal(featured.length,6);
for(const item of cases){
 assert.match(item.model,/^Qwen4(?:-Max(?:-Preview)?| \(variant unspecified\))$/);
 assert.equal(item.caseUrl,`https://beatapi.io/prompts/qwen4/${item.id}`);
 assert.ok(item.creator&&item.originalPostUrl&&item.videos.length);
 assert.equal(item.promptStatus==='creator-text-verified',Boolean(prompts[item.id]));
 for(const v of item.videos){
  for(const url of [v.url,v.posterUrl])assert.equal(new URL(url).origin,'https://cdn.beatapi.io');
  assert.match(v.sha256,/^[a-f0-9]{64}$/);assert.ok(v.url.includes(v.sha256.slice(0,12)));assert.ok(v.bytes>0);
 }
 const p=prompts[item.id];
 emit(`cases/${item.id}.md`,`# ${item.title.en}\n\n[![${item.title.en}](${item.previewUrl})](${owned(`/prompts/qwen4/${item.id}`)})\n\n**[Watch this case on BeatAPI →](${owned(`/prompts/qwen4/${item.id}`)})**\n\n- Model: ${item.model} (creator-reported)\n- Creator: [${item.creator}](${item.originalPostUrl})\n- Workflow: ${item.workflow.join(', ')||'Not specified by the creator'}\n- Source checked: ${item.checkedAt}\n- Prompt: ${p?'Published by the creator':'Complete prompt not verified'}\n${item.mediaLabels?`- Recording order: ${item.mediaLabels.join(' / ')}\n`:''}\n${item.disclosure?`${item.disclosure} The video watermark says Qoduck; preserve this version uncertainty.\n\n`:''}${p?`## Creator-published prompt\n\n\`\`\`text\n${p.text}\n\`\`\`\n\n[Prompt source](${p.sourceUrl})\n\n`:''}The recording is a creator example, not an independent BeatAPI reproduction. Media and prompts retain their original rights; no additional media license is asserted.\n`);
}
const groups=[
 {id:'architecture',en:'Architecture & building',zh:'建筑与搭建',categories:['architecture']},
 {id:'animation',en:'Animation & explainers',zh:'动画与讲解',categories:['animation','film','explainer']},
 {id:'worlds',en:'3D worlds & games',zh:'三维场景与游戏',categories:['scene','game']},
 {id:'workflows',en:'Workflow comparisons',zh:'工作流对照',categories:['workflow']},
];
function grid(items,zh,columns=3){
 const locale=zh?'zh':'en';
 const cards=items.map(item=>`<td width="${columns===2?'50':'33'}%" valign="top"><a href="${escape(owned(`/prompts/qwen4/${item.id}`,zh))}"><img src="./assets/posters/${item.id}.jpg" alt="${escape(item.title[locale])}" width="100%" /></a><br/><a href="${escape(owned(`/prompts/qwen4/${item.id}`,zh))}"><strong>${escape(item.title[locale])}</strong></a><br/><sub>${item.model} · ${Math.round(item.videos[0].durationSeconds)}s</sub><br/><a href="${escape(owned(`/prompts/qwen4/${item.id}`,zh))}">${zh?'▶ 观看视频':'▶ Watch video'}</a> · <a href="cases/${item.id}.md">${prompts[item.id]?(zh?'提示词':'Prompt'):(zh?'案例说明':'Case notes')}</a><br/><sub>${zh?'作者':'By'} <a href="${item.originalPostUrl}">@${escape(item.creator)}</a></sub></td>`);
 const rows=[];for(let i=0;i<cards.length;i+=columns)rows.push(`<tr>\n${cards.slice(i,i+columns).join('\n')}\n</tr>`);
 return `<table>\n${rows.join('\n')}\n</table>`;
}
assert.ok(existsSync(new URL('assets/readme-cover.png',root)));
for(const item of cases) assert.ok(existsSync(new URL(`assets/posters/${item.id}.jpg`,root)));
for(const zh of [false,true]){
 const locale=zh?'zh':'en';
 const intro=zh?'用千问 4 写代码，做出动画、建筑演示、三维场景和游戏。这里整理原作者的真实录屏、工作流和已公开提示词，点击封面即可进入 BeatAPI 对应案例观看。':'Animations, architecture, 3D scenes and games made through creative coding with Qwen 4. Explore original creator recordings, workflows and published prompts. Every cover opens the corresponding case on BeatAPI.';
 const boundary=zh?'保留作者标注的 Qwen4-Max / Max-Preview 版本。案例是代码生成作品的录屏，模型归属依据作者说明，未作本站独立复现；不等同于原生视频生成 API 的测评。':'Max and Max-Preview labels are preserved as reported by each creator. These are recordings of code-generated work, not independent reproductions or a native video-generation API benchmark.';
 const contents=groups.map(g=>`[${zh?g.zh:g.en}](#${g.id}) (${cases.filter(x=>g.categories.includes(x.category)).length})`).join(' · ');
 const catalog=groups.map(g=>`<a id="${g.id}"></a>\n\n## ${zh?g.zh:g.en}\n\n${grid(cases.filter(x=>g.categories.includes(x.category)),zh)}`).join('\n\n');
 emit(zh?'README.zh-CN.md':'README.md',`<p align="center"><a href="${escape(owned('/qwen4-videos',zh))}"><img src="./assets/readme-cover.png" alt="Qwen 4 creative coding — real creator examples curated by BeatAPI" width="100%" /></a></p>\n\n# Awesome Qwen 4 Videos\n\n${intro}\n\n${zh?'> 网站页面正在审核，站内播放入口将在审核后上线。':'> Website launch review is in progress. On-site playback links will become available after approval.'}\n\n**[${zh?'浏览视频案例库':'Browse the video gallery'} →](${owned('/qwen4-videos',zh)})** · [${zh?'English':'中文'}](${zh?'README.md':'README.zh-CN.md'}) · [${zh?'贡献案例':'Contribute a case'}](CONTRIBUTING.md)\n\n**${cases.length} ${zh?'个案例':'cases'} · ${cases.reduce((n,x)=>n+x.videos.length,0)} ${zh?'段视频':'videos'} · ${Object.keys(prompts).length} ${zh?'条公开提示词':'published prompts'}**\n\n## ${zh?'先看这六个':'Start with six'}\n\n${grid(featured,zh,2)}\n\n**[${zh?'在本站浏览全部案例':'Watch every case on our site'} →](${owned('/qwen4-videos',zh)})**\n\n## ${zh?'按用途浏览':'Browse by use'}\n\n${contents}\n\n${catalog}\n\n## ${zh?'收录说明':'About this collection'}\n\n${boundary}\n\n${zh?'播放视频与封面由 BeatAPI 保存。原作者链接用于署名和溯源；没有公开核实的完整提示词不会补写为原始提示词。':'Videos and posters are hosted by BeatAPI. Creator links provide attribution and provenance. Missing prompts are not reconstructed or presented as originals.'}\n\n[${zh?'Reddit 调研与待入库线索':'Reddit research and pending candidates'}](RESEARCH.md) · [${zh?'许可与来源':'Rights and attribution'}](THIRD_PARTY_NOTICES.md)\n\n## ${zh?'继续完善':'Keep the library growing'}\n\n${zh?'每次更新：核对原帖 → 保存原始视频与封面 → 核对提示词 → 同步本站案例 → 挑选六个不同用途的入口 → 运行链接与目录校验。':'For each update: verify the source → archive the original recording and poster → verify prompt text → sync the site case → review six distinct starting points → run catalog and link checks.'}\n\n\`\`\`sh\nnpm run build\nnpm test\n\`\`\`\n\n${zh?'欢迎提交新作品、补充提示词或反馈失效素材。请附原作者链接和准确模型版本。':'Contribute new works, missing prompts or broken-media reports with the original creator URL and exact model version.'}\n`);
}
if(check&&changed.length)throw new Error(`Generated files differ: ${changed.join(', ')}`);
console.log(JSON.stringify({cases:cases.length,videos:cases.reduce((n,x)=>n+x.videos.length,0),prompts:Object.keys(prompts).length,featured:featured.length,changed:changed.length,check}));
