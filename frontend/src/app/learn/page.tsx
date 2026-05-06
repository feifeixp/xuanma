'use client';

import { motion } from 'framer-motion';

const POEM = `阴阳顺逆妙难穷，二至还归一九宫，若能了达阴阳理，天地都在一掌中，
轩辕黄帝战蚩尤，涿鹿经年苦未休，偶梦天神授符诀，登坛致祭谨虔修，
神龙负图岀洛水，彩凤衔书碧云里，因命风后演成文，遁甲奇门从此始，
一千八十当时制，太公删成七十二，逮于汉代张子房，一十八局为精艺，
先须掌上排九宫，纵横十五在其中，次将八卦分八节，一气统三为正宗，
阴阳二遁分顺逆，一气三元人莫测，五日都来换一元，接气超神为准则，
认取九宫分九星，八门又逐九宫行，九宫逢甲为值符，八门值使自分明，
符上之门为值使，十时一易堪凭据，值符常遣加时干，值使顺逆遁宫去，
六甲元号六仪名，三奇即是乙丙丁，阳遁顺仪奇逆布，阴遁逆仪奇顺行，
吉门偶尔合三奇，值此经云百事宜，更合从傍加检点，余宫不可有微疵，
三奇得使诚堪使，六甲遇之非小补，乙逢犬马丙鼠猴，六丁玉女骑龙虎，
又有三奇游六仪，号为玉女守门扉，若作阴私和合事，请君但向此中推，
天三门兮地四户，问君此法如何处，太冲小吉与从魁，此是天门私出路，
地户除危定与开，举事皆从此中去，六合太阴太常君，三辰元是地私门，
更得奇门相照耀，岀行百事总欣欣，太冲天马最为贵，猝然有难宜逃避，
但能乘驭天马行，剑戟如山不足畏，三为生气五为死，胜在三兮衰在五，
能识游三避五时，造化真机须记取，就中伏吟为最凶，天蓬加临地天蓬，
天蓬若到天英上，须知即是反吟宫，八门反伏皆如此，生在生兮死在死，
就是凶宿得奇门，万事皆凶不堪使，六仪击刑何太凶，甲子直符愁向东，
戌刑未上申刑虎，寅巳辰辰午刑午，三奇入墓宜细推，甲日那堪入坤宫，
丙奇属火火墓戌，此时诸事不宜为，更兼六乙来临二，丁奇临八亦同论，
又有时干入墓宫，课中时下忌相逢，戊戌壬辰兼丙戌，癸未丁丑亦同凶，
五不遇时龙不精，号为日月损光明，时干来克日干上，甲日须知时忌庚，
奇与门兮共太阴，三般难得共加临，若还得二亦为吉，举措行藏必遂心，
更得值符直使利，兵家用事最为贵，常从此地击其冲，百战百胜君须记，
天乙之神所在宫，大将宜居击对冲，假令值符居离位，天英坐取击天蓬，
甲乙丙丁戊阳时，神人天上报君知，坐击须凭天上奇，阴时地下亦如此，
若见三奇在五阳，偏宜为客是高强，忽然逢着五阴位，又宜为主好裁详，
值符前三六合位，太阴之神在前二，后一宫中为九天，后二之神为九地，
九天之上好扬兵，九地潜藏可立营，伏兵但向太阴位，若逢六合利逃形，
天地人分三遁名，天遁日精华盖临，地遁月精紫云蔽，人遁当知是太阴，
生门六丙合六丁，此为天遁自分明，开门六乙合六己，地遁如斯而已矣，
休门六丁共太阴，欲求人遁无过此，要知三遁何所宜，藏形遁迹斯为美，
庚为太白丙荧惑，庚丙相加谁会得，六庚加丙白入荧，六丙加庚荧入白，
白入荧兮贼即来，荧入白兮贼即去，丙为悖兮庚为格，格则不通悖乱逆，
天丙加地庚为勃，天庚加地癸为格，丙加天乙为伏逆，天乙加丙为飞悖，
庚加日干为伏干，日干加庚飞干格，加一宫兮战在野，同一宫兮战于国，
庚加值符天乙伏，值符加庚天乙飞，庚加癸兮为大格，加己为刑最不宜，
加壬之时为上格，又嫌年月日时逢，更有一般奇格者，六庚谨勿加三奇，
此时若也行兵去，匹马只轮无返期，六癸加丁蛇夭蹻，六丁加癸雀投江，
六乙加辛龙逃走，六辛加乙虎猖狂，请观四者是凶神，百事逢之莫措手，
丙加甲兮鸟跌穴，甲加丙兮龙返首，只此二者是吉神，为事如意十八九，
八门若遇开休生，诸事逢之皆称情，伤宜捕猎终须获，杜好邀遮及隐形，
景上投书并破阵，惊能擒讼有声名，若问死门何所主，只宜吊死与行刑，
蓬任冲辅禽阳星，英芮柱心阴宿名，辅禽心星为上吉，冲任小吉未全亨，
大凶蓬芮不堪使，小凶英柱不精明，小凶无气变为吉，大凶无气却平平，
吉宿更能逢旺相，万举万全必成功，若遇休囚并废没，劝君不必走前程，
要识九星配五行，须求八卦考羲经，坎蓬水星离英火，中宫坤艮土为营，
乾兑为金震巽木，旺相休囚看重轻，与我同行即为相，我生之月诚为旺，
废于父母休于财，囚于鬼兮真不妄，假令水宿号天蓬，相在初冬与仲冬，
旺于正二休四五，其余仿此自研穷，急则从神缓从门，三五反复天道亨，
十干加伏若加错，入墓休囚吉事危，十精为使用为贵，起宫天乙用无遗，
天目为客地耳主，六甲推兮无差理，劝君莫失此玄机，洞彻九宫辅明主，
宫制其门不为迫，门制其宫是迫雄，天网四张无走路，一二网低有路踪，
三至四宫难回避，八九高张任西东，节气推移时候定，阴阳顺逆要精通，
三元积数成六纪，天地未成有一理，请观歌里真妙诀，非是真贤莫传与。`;

// 按章节分段
const SECTIONS = [
  { title: '总纲', lines: POEM.split('\n')[0], desc: '阴阳顺逆、二至归宫、天地一掌' },
  { title: '传说起源', lines: POEM.split('\n').slice(0, 4).join('\n'), desc: '轩辕黄帝战蚩尤，神龙负图，风后演成文' },
  { title: '历史流变', lines: POEM.split('\n')[3], desc: '一千八十制 → 太公七十二 → 张良十八局' },
  { title: '宫卦节气', lines: POEM.split('\n')[4], desc: '掌上排九宫，纵横十五，八卦分八节，一气统三' },
  { title: '阴阳二遁', lines: POEM.split('\n')[5], desc: '阴阳顺逆，一气三元，五日换一元，接气超神' },
  { title: '九星八门', lines: POEM.split('\n')[6], desc: '九宫配九星，八门逐九宫，逢甲为值符' },
  { title: '值符值使', lines: POEM.split('\n')[7], desc: '符上之门为值使，十时一易，值符加时干' },
  { title: '六仪三奇', lines: POEM.split('\n')[8], desc: '六甲六仪，乙丙丁为三奇，阳顺阴逆排布' },
  { title: '吉格凶格', lines: POEM.split('\n').slice(9, 37).join('\n'), desc: '三奇得使、玉女守门、天门地户、天马、反吟伏吟、六仪击刑、三奇入墓、五不遇时' },
  { title: '八门吉凶', lines: POEM.split('\n').slice(37, 39).join('\n'), desc: '开休生为吉，伤杜景死惊各有其用' },
  { title: '星门神格', lines: POEM.split('\n').slice(39, 51).join('\n'), desc: '九星吉凶旺衰、八神排布宜忌、三遁、庚丙格、龙逃走虎猖狂等' },
  { title: '结语', lines: POEM.split('\n')[51], desc: '三元积数成六纪，非是真贤莫传与' },
];

export default function YanBoDiaoSouPage() {
  const lines = POEM.split('\n');

  return (
    <main className="relative z-10 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-5xl md:text-6xl text-bronze-primary tracking-[0.2em] mb-4">
            烟波钓叟赋
          </h1>
          <p className="text-text-secondary text-sm tracking-widest">
            奇门遁甲核心歌诀 · 排盘规则总纲
          </p>
          <div className="mt-3 w-16 h-px bg-bronze-dim/30 mx-auto" />
        </motion.div>

        {/* 内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="space-y-6"
        >
          {lines.map((line, i) => {
            // 每两句一组，奇数行（0-indexed偶数为起始）
            if (i % 2 === 1) return null; // 跳过奇数行，由上一行一起展示

            const couplet = line + (lines[i + 1] ? '\n' + lines[i + 1] : '');

            // 找出匹配的章节
            const sectionMatch = SECTIONS.find(s => couplet.includes(s.lines.split('\n')[0].trim()));

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.03, duration: 0.4 }}
                className="group"
              >
                {/* 章节标题 */}
                {sectionMatch && (
                  <div className="mb-2 mt-8 first:mt-0">
                    <h3 className="font-display text-lg text-bronze-primary tracking-wider">
                      {sectionMatch.title}
                    </h3>
                    <p className="text-xs text-bronze-dim/40 mt-0.5">{sectionMatch.desc}</p>
                  </div>
                )}

                {/* 诗句 */}
                <div className="p-3 rounded-sm bg-surface/20 border border-bronze-dim/5 group-hover:border-bronze-dim/15 transition-all duration-300">
                  <p className="font-display text-text-primary/80 leading-relaxed tracking-wide text-lg">
                    {couplet.split('\n').map((l, j) => (
                      <span key={j}>
                        {l.trim()}
                        {j === 0 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 底部 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-16 text-center"
        >
          <div className="w-16 h-px bg-bronze-dim/20 mx-auto mb-6" />
          <p className="text-xs text-bronze-dim/30 font-display tracking-[0.2em]">
            九天玄码 · 道藏传承
          </p>
        </motion.div>
      </div>
    </main>
  );
}
