// [INPUT]: Reviewed creator cases and original prompts in cases/.
// [OUTPUT]: Bilingual visual README with non-repeating curated grids, case pages and owned links.
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
function grid(items, zh) {
 const locale = zh ? 'zh' : 'en';
 const cards = items.map(item => {
  const href = escape(owned(`/prompts/qwen4/${item.id}`, zh));
  const model = item.model.replace('Qwen4-', '').replace('Qwen4 (variant unspecified)', zh ? '版本未明确' : 'Variant unspecified');
  const facts = [model, ...item.workflow.slice(0, 2), `${Math.round(item.videos[0].durationSeconds)}s`].join(' · ');
  return `<td width="33%" valign="top"><a href="${href}"><img src="./assets/posters/${item.id}.jpg" alt="${escape(item.title[locale])}" width="100%" /></a><br/><a href="${href}"><strong>${escape(item.title[locale])}</strong></a><br/><sub>${escape(facts)}</sub><br/><a href="cases/${item.id}.md">${prompts[item.id] ? (zh ? '提示词' : 'Prompt') : (zh ? '案例说明' : 'Case notes')}</a> · <sub><a href="${escape(item.originalPostUrl)}">@${escape(item.creator)}</a></sub></td>`;
 });
 const rows = [];
 for (let i = 0; i < cards.length; i += 3) {
  const row = cards.slice(i, i + 3);
  while (row.length < 3) row.push('<td width="33%"></td>');
  rows.push(`<tr>\n${row.join('\n')}\n</tr>`);
 }
 return `<table>\n${rows.join('\n')}\n</table>`;
}
assert.ok(existsSync(new URL('assets/readme-cover.png',root)));
for(const item of cases) assert.ok(existsSync(new URL(`assets/posters/${item.id}.jpg`,root)));
for(const zh of [false,true]){
 const intro = zh
  ? '用千问 4 写代码，做出动画、建筑演示、三维场景和游戏。收录原作者录屏、工作流与已公开提示词，点击作品封面即可进入 BeatAPI 对应案例。'
  : 'Animations, architecture, 3D scenes and games made through creative coding with Qwen 4. Explore creator recordings, workflows and published prompts. Each cover opens its case on BeatAPI.';
 const counts = `**${cases.length} ${zh?'个案例':'cases'} · ${cases.reduce((n,x)=>n+x.videos.length,0)} ${zh?'段视频':'videos'} · ${Object.keys(prompts).length} ${zh?'条公开提示词':'published prompts'}**`;
 const contents = [
  `- [${zh?'精选六例':'Six highlights'}](#highlights)`,
  ...groups.map(g => `- [${zh?g.zh:g.en}](#${g.id}) · ${cases.filter(x=>g.categories.includes(x.category)).length}`),
  `- [${zh?'如何观看与使用':'How to watch and use'}](#how-to-use)`,
  `- [${zh?'贡献与来源':'Contributing & credits'}](#credits)`,
 ].join('\n');
 const catalog = groups.map(g => {
  const all = cases.filter(x => g.categories.includes(x.category));
  const picks = all.filter(x => x.featured);
  const rest = all.filter(x => !x.featured);
  const note = picks.length
   ? (zh ? `共 ${all.length} 个案例；${picks.length} 个已在上方精选展示，下面为其余 ${rest.length} 个。` : `${all.length} cases in total; ${picks.length} featured above, ${rest.length} more below.`)
   : (zh ? `${all.length} 个案例。` : `${all.length} case${all.length === 1 ? '' : 's'}.`);
  const links = picks.length ? `\n\n${zh?'本类精选':'Featured in this category'}：${picks.map(x=>`[${x.title[zh?'zh':'en']}](${owned(`/prompts/qwen4/${x.id}`,zh)})`).join(' · ')}` : '';
  return `<a id="${g.id}"></a>\n\n## ${zh?g.zh:g.en}\n\n${note}${links}\n\n${rest.length?grid(rest,zh):''}`;
 }).join('\n\n');
 const body = `<p align="center"><a href="${escape(owned('/qwen4-videos',zh))}"><img src="./assets/readme-cover.png" alt="Qwen 4 creative coding — real creator examples curated by BeatAPI" width="100%" /></a></p>

# Awesome Qwen 4 Videos

${intro}

**[${zh?'在 BeatAPI 观看全部案例':'Watch every case on BeatAPI'} →](${owned('/qwen4-videos',zh)})** · [${zh?'English':'中文'}](${zh?'README.md':'README.zh-CN.md'})

${counts}

${zh?'最近更新 · 2026-11-16：整理 21 个案例，精选六例，按用途分类。':'Latest update · 2026-11-16: 21 cases organized by use, with six highlights.'}

${zh?'> 网站页面正在审核，站内播放入口将在审核后上线。':'> Website launch review is in progress. On-site playback links will become available after approval.'}

## ${zh?'目录':'Contents'}

${contents}

<a id="highlights"></a>

## ${zh?'精选六例':'Six highlights'}

${zh?'先从建筑、机械动画、绘画与三维场景开始。点击封面或标题观看；有公开提示词的案例提供「提示词」入口，其余提供「案例说明」。':'Start with architecture, mechanical animation, painting and 3D scenes. Open a cover or title to watch. Published prompts are labeled “Prompt”; other entries link to case notes.'}

${grid(featured,zh)}

${catalog}

<a id="how-to-use"></a>

## ${zh?'如何观看与使用':'How to watch and use'}

${zh?'1. 点击作品封面或标题，在 BeatAPI 查看对应案例的视频与模型信息。\n2. 有公开提示词时，可在详情页复制，或打开仓库内的「提示词」。\n3. 按作者提供的工具、素材和步骤尝试；未公开完整提示词的案例保留为灵感参考。':'1. Open a cover or title to view the video and model details on BeatAPI.\n2. Copy a published prompt on the detail page, or open its “Prompt” link in this repository.\n3. Follow the creator’s tools, assets and instructions. Cases without a published prompt remain references for inspiration.'}

<p align="center"><a href="${escape(owned('/prompts/qwen4/fisherman-oil-portrait-932340',zh))}"><img src="./assets/site-detail-preview.png" alt="${zh?'BeatAPI 详情页审核预览：左侧视频，右侧模型信息与提示词':'BeatAPI detail review preview: video, model information and prompt'}" width="680" /></a></p>

${zh?'*站内详情页审核预览。*':'*Website detail page shown in its review version.*'}

<a id="credits"></a>

## ${zh?'贡献与来源':'Contributing & credits'}

${zh?'欢迎补充作品、原始提示词或反馈失效素材。请附原作者链接和准确模型版本，见[贡献指南](CONTRIBUTING.md)。':'Contribute a work, an original prompt or a broken-media report with its creator URL and exact model version. See [the contribution guide](CONTRIBUTING.md).'}

${zh?'保留作者标注的 Qwen4-Max / Max-Preview 等版本；案例为代码生成作品的录屏，未作 BeatAPI 独立复现，也不等同于原生视频生成 API 的测评。视频与封面由 BeatAPI 保存，作者链接用于署名与溯源；未核实的提示词不会补写为原始提示词。':'Model variants are preserved as reported by creators. These are recordings of code-generated work, not independent BeatAPI reproductions or a native video-generation API benchmark. BeatAPI hosts the videos and posters; creator links provide attribution. Missing prompts are not reconstructed as originals.'}

[${zh?'许可与来源':'Rights and attribution'}](THIRD_PARTY_NOTICES.md) · [${zh?'调研与待入库线索':'Research and pending candidates'}](RESEARCH.md)
`;
 // All cases remain discoverable once as a cover, with no duplicate featured cards.
 const cardIds = [...body.matchAll(/src="\.\/assets\/posters\/([^"/]+)\.jpg"/g)].map(x=>x[1]);
 assert.equal(cardIds.length, cases.length);
 assert.equal(new Set(cardIds).size, cases.length);
 for (const link of body.matchAll(/href="([^"]+)"/g)) {
  const href = link[1].replaceAll('&amp;', '&');
  if (href.includes('/prompts/qwen4/') || href.includes('/qwen4-videos')) assert.equal(new URL(href).origin, 'https://beatapi.io');
 }
 emit(zh?'README.zh-CN.md':'README.md',body);
}
if(check&&changed.length)throw new Error(`Generated files differ: ${changed.join(', ')}`);
console.log(JSON.stringify({cases:cases.length,videos:cases.reduce((n,x)=>n+x.videos.length,0),prompts:Object.keys(prompts).length,featured:featured.length,changed:changed.length,check}));
