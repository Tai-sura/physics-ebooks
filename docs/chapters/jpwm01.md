# jpwm01 — Nature of waves (JPWM01)

- **book id**: `jpwm01`（永不改名：它是每部 iPad 的筆跡儲存鍵）
- **form**: S4   **code**: JPWM01   **title**: Nature of waves   **topic**: Nature of waves
- **source**: QUE 1,293,471 B ＋ ANS 1,940,755 B，兩個檔都在 `books/jpwm01/source/`
  - `Chapter 1 Wave Motion - regular 2026-27 @Uni.pdf`
  - `Chapter 1 Wave Motion - regular 2026-27 (Ans) @Uni.pdf`
- **status**: stage 1 完成（骨架、sections、questions、region 已落；region 經像素驗證 0 FAIL）
- **已登記**: `books/catalog.json` 已列出 `jpwm01`

## ansPageOffset: **0**（已核實，2026-11-26，ebook）

四個量測都指向同一答案：

1. 兩份 PDF 都是 **17 頁**，而且每頁印刷頁碼 = 自己那一頁（ANS p1 印「1」… p17 印「17」）。
2. 每頁 running head 兩份完全一樣：`2026-27` / `Waves` / `(Wave motion)`。
3. 每頁題號完全一樣（用 `^\s*(\d{1,2})\.\s` 抽）：
   p1 `[1]`、p2 `[2,3]`、p3 `[4,5,6]`、p4 `[9,7,8]`、p5 `[10,11,13,12]`、p6 `[15,14,17,16]`、
   p7 `[20,19,21,18]`、p8 `[23,22]`、p9 `[25,24,27,28,26]`、p10 `[29,1,2]`、p11 `[30]`、p12 `[31]`、
   p13 `[32]`、p14 `[33]`、p15 `[34]`、p16 `[35]`、p17 `[36]`——QUE 與 ANS 逐頁相同。
4. 逐頁看圖：ANS p4 = QUE p4 的印刷內容 **加**紅色答案（Q7 的 `D`、Q8 的 `B`、Q9 的 `0.8 s`）；
   ANS p10 = QUE p10 加紅色解答（Q29 的 `f = 1/0.25 = 4 Hz`、`v = fλ = 3.2 ms⁻¹`）。

ANS 第 1 頁已經有 Q1，**沒有封面**，所以不是 −1；ANS 頁 N ↔ QUE 頁 N。

## 題目清單：36 題（q1–q36）

`extract_pages.py --scan` 原本掃出 39 條，其中 3 條是誤判，已在 `extract.questions` 手寫剔除：

| 誤判 | 位置 | 真相 |
|---|---|---|
| `q0` | p14 y=97.8，`x=50.5` token `0` | Q33 句子 `…at time t = 0 and t = 0.6 s.` 換行，`0` 落在行首 |
| `q1`（重複） | p7 y=357，`x=77.3` token `1` | Q19 圖的橫軸刻度 `1`（同一個圖另有 0.25/0.5/0.75） |
| `q1`、`q2`（重複） | p10 y=126/144，`x=48.7` | 「Graphical description of wave motion」框內的第 1、2 點列表 |

三種誤判同一個成因：token 是純數字、x0 < 80、行首即出現——掃描器當它是題號。
真正題目是印刷的 `1.`–`36.`，共 **36 題**（17 頁）。

## Sections（4 段，全部是印刷的單線方框標題）

| id | label | pages | questions | 依據（box 標題位置） |
|---|---|---|---|---|
| `wave` | Wave motion | p1–p9 | q1–q21 | p1 y=78.1 方框「Wave motion」（章節標題框） |
| `direction` | Direction of motion of particles | p8 | q22 | p8 y=76.7 方框 |
| `phase` | Phase | p8–p9 | q23–q28 | p8 y=412.5 方框 |
| `graphical` | Graphical description of wave motion | p10–p17 | q29–q36 | p10 y=79.2 方框 |

- p1 的「Transverse wave」「Longitudinal wave」（y≈332，彩色字）是左右對照框的標題，**不是** section。
- p9（Q24–Q28）頁頂沒有新標題，所以整版仍屬 `phase`——跟印刷次序，不自己另立一段。
- q22 單獨成段是印刷事實：p8「Direction of motion of particles」框只帶一題（Q22 三小問）。

## Answer region（`extract_pages.py jpwm01`，2026-11-26，footer 790）

頁面 595.32 × 841.92 pt（A4），zoom 3，`regionX [66, 546]`；`pages/p01–p17.jpg` 17 張 1786×2526。

### `extract.footer: 822 → 790`

量法：把 17 頁各自 render 成 3× 點陣，逐行找 y > 780 的第一行墨跡（像素 < 200）。頁碼的墨跡第一行是
**804.67**（p2/p6…p17，x 533.7–540.7；p1–p9 的頁碼 x 536.4–541.4），警告行由 **810.40** 起
（x 209.2–384.9）。原本 `footer 822` 比頁碼低 17.3 pt，令 q1/q3/q6/q13/q17/q21/q23/q29 的
`region[3]`（808.5–810.2）跨過頁碼，切口會把頁碼切成兩半。790 令所有底邊 ≤ 786，距頁碼墨跡 18.7 pt。

### `extract.overrides`

| 題 | override | 為什麼要手動定（自己量的數） |
|---|---|---|
| q1 | `region [66,764,224,786]` | p1 的網格圖左框線在 x≈229 由 y690 一路畫到頁底，**全頁冇一條全寬空白行**；答案只能放左欄（Answer 框底下）158×22，切口不可用 |
| q4 | `region [66,388,218,531.5]` | 原底邊 526 會切到 x 222–549 的圖（149 px）；p3 全寬無墨行 531.5–694.0 共 102 行（JPG 量），底邊收 531.5，區內 0 墨、高 143.5，**可以開 space** |
| q6 | `region [66,758,250,786]` | p3 的波形谷底（D 點）伸到 y787，全寬最後空白帶只有 787.33–792（4.7 pt，不可用）；答案放選項下方的左欄 184×28 |
| q7 | 底邊 222.9 → **223.0** | 原底邊在 3× 點陣第 668 行（半個像素），圖格底邊的抗鋸齒在 220.67；223.0 落在行界，切口 ±0.67 pt 內 0 墨 |
| q13 | `region [66,750.5,236,779.0]` | 原底邊 784.5 會切到墨（318 px）；p5 全寬無墨行 776.0–779.0（JPG 量），收 779.0，區內 0 墨、高 28.5，**可以開 space** |
| q22 | `region [93,363.5,396,404.0]` | 原 `[92,352.2,302,436.2]` 壓住 Q22 (iii) 行；p8 全寬空白帶 397.33–405.00，404.5 會碰 Phase 框頂（405.00），故收 404.0；區內 0 墨 |
| q23 | `region [66,752,546,785.2]` | footer 790 後底邊伸到 785.2，頂邊 751.2 吃到上一行墨（y745–751.3）；p8 由 751.67 起全寬空白，頂邊抬到 752 |
| q27 | 底邊 625.3 → **626.0** | 625.3 在 3× 點陣第 1875.9 行（半像素）；626.0 在行界，±0.67 pt 內 0 墨（上方最近墨 622.0） |
| q28 | `region [190,714.2,374,780.5]` | 原切口 829.4 在警告行（810.4–826.4）之下；選項 D 印在 800.4–813.6，其下冇合法切口。**JPG 上** p9 全寬無墨行只到 781.0：781.33 有 1 px、782.0 有 7 px（選項 C 抗鋸齒），783.0 起 52 px 實墨；故底邊 780.5（距 781.33 的 1.0 pt、距 783.0 的 2.5 pt），放選項右邊的白色通道 |

### 36 題 rect

| q | pg | section | anchor (y) | region `[x0, y0, x1, y1]` | 大小 w×h |
|---|---|---|---|---|---|
| q1 | 1 | wave | 674.6–690.1 | 66, 764, 224, 786 | 158×22 |
| q2 | 2 | wave | 327.6–340.9 | 66, 435.1, 214, 477.1 | 148×42 |
| q3 | 2 | wave | 487.3–500.5 | 66, 754.6, 546, 784.6 | 480×30 |
| q4 | 3 | wave | 368.7–382.0 | 66, 388, 218, 531.5 | 152×143.5 |
| q5 | 3 | wave | 536.8–550.1 | 66, 652.1, 546, 654.1 | 480×2（切口） |
| q6 | 3 | wave | 675.0–688.3 | 66, 758, 250, 786 | 184×28 |
| q7 | 4 | wave | 114.6–127.9 | 66, 220.9, 546, 223 | 480×2.1（切口） |
| q8 | 4 | wave | 232.3–245.6 | 66, 322.6, 546, 324.6 | 480×2（切口） |
| q9 | 4 | wave | 557.1–570.4 | 66, 694.4, 256, 784.4 | 190×90 |
| q10 | 5 | wave | 173.9–187.2 | 216, 237.2, 546, 293.2 | 330×56 |
| q11 | 5 | wave | 303.3–316.6 | 66, 421, 546, 451 | 480×30 |
| q12 | 5 | wave | 462.3–475.6 | 66, 580.2, 546, 608.2 | 480×28 |
| q13 | 5 | wave | 619.1–632.4 | 66, 750.5, 236, 779 | 170×28.5 |
| q14 | 6 | wave | 72.4–85.8 | 66, 255.2, 546, 257.2 | 480×2（切口） |
| q15 | 6 | wave | 266.7–280.0 | 66, 454.9, 546, 456.9 | 480×2（切口） |
| q16 | 6 | wave | 467.1–480.4 | 66, 635.4, 546, 637.4 | 480×2（切口） |
| q17 | 6 | wave | 661.6–674.9 | 66, 781.3, 546, 783.3 | 480×2（切口） |
| q18 | 7 | wave | 87.5–100.8 | 66, 188.8, 336, 244.8 | 270×56 |
| q19 | 7 | wave | 256.1–269.4 | 66, 383.4, 546, 419.4 | 480×36 |
| q20 | 7 | wave | 430.7–444.0 | 66, 567, 546, 569 | 480×2（切口） |
| q21 | 7 | wave | 590.8–604.1 | 66, 760.1, 546, 762.1 | 480×2（切口） |
| q22 | 8 | direction | 278.9–292.2 | 93, 363.5, 396, 404 | 303×40.5 |
| q23 | 8 | phase | 678.0–691.3 | 66, 752, 546, 785.2 | 480×33.2 |
| q24 | 9 | phase | 73.2–86.5 | 66, 187.5, 546, 189.5 | 480×2（切口） |
| q25 | 9 | phase | 195.4–208.7 | 66, 329.7, 546, 331.7 | 480×2（切口） |
| q26 | 9 | phase | 342.5–355.8 | 66, 490.8, 546, 492.8 | 480×2（切口） |
| q27 | 9 | phase | 509.1–522.4 | 66, 623.3, 546, 626 | 480×2.7（切口） |
| q28 | 9 | phase | 640.2–653.5 | 190, 714.2, 374, 780.5 | 184×66.3 |
| q29 | 10 | graphical | 303.5–316.8 | 66, 692.8, 546, 784.8 | 480×92 |
| q30 | 11 | graphical | 80.0–93.3 | 66, 531.3, 546, 785.3 | 480×254 |
| q31 | 12 | graphical | 78.5–91.8 | 66, 375.8, 546, 785.8 | 480×410 |
| q32 | 13 | graphical | 75.2–88.5 | 66, 422.6, 546, 784.6 | 480×362 |
| q33 | 14 | graphical | 79.8–93.1 | 66, 295.1, 546, 785.1 | 480×490 |
| q34 | 15 | graphical | 79.8–93.1 | 66, 359.1, 546, 785.1 | 480×426 |
| q35 | 16 | graphical | 77.8–91.1 | 66, 447.1, 546, 785.1 | 480×338 |
| q36 | 17 | graphical | 77.8–91.1 | 66, 537.1, 546, 785.1 | 480×248 |

### 驗證（36 條逐條量，量 **`pages/pNN.jpg`**，即閱讀器真正切的圖）

**量法教訓**：切口與區內墨要量 `pages/pNN.jpg`，不是重新 render PDF。JPEG（quality 86）會在字邊加
1–2 pt 的抗鋸齒光暈：q28 在 PDF render 上到 782.67 都「全白」，在 JPG 上 781.33 已有 1 px、782.0 有 7 px。

- **區內墨**：36/36 `px < 170` = 0；`< 245` 只有 q6 4 px、q7 9 px、q27 1 px（都是字／圖邊的抗鋸齒，無實墨）。
- **底邊 ≤ 790**：36/36（最高 786.0）。
- **切口合法**（13 條 2 pt 切口，全頁寬 ±0.67 pt）：**cutpx 全 0**——q5、q7、q8、q14、q15、q16、q17、
  q20、q21、q24、q25、q26、q27。
- **底邊全寬乾淨、可以開 `space`**：q2、q3、q4、q10、q11、q12、q13、q18、q19、q22、q23、q28、q29、
  q30–q36（JPG 上底邊那一行 0 墨）。
- **冇合法切口的 3 題**：q1（p1 底邊行 287 px：網格框到頁底）、q6（54 px）、q9（1519 px：網格底邊）。
  這 3 題答案只能塞入 region，或由 `layout_triage` 判為卡片題。

## Stage 2 待辦（不是 stage 1 的交付）

1. **13 條切口要配 `space`**：值要等 stage 3 有解答、量過實際行數才定（`answers.js` 高度 = region 高 + space）。
2. **q1／q6／q9 冇合法切口**：答案必須落得入 region（22／28／90 pt），或者由 `layout_triage` 判為卡片題。
3. q22 的 303×40.5、q28 的 184×66.3、q23 的 480×33.2、q13 的 170×28.5 都要用真實解答驗一次夠不夠高。

## Stage 3 解答（`solutions.js`，2026-11-26，ebook）

**36 entries／182 steps**，`solutions.js` 17,467 bytes、md5 `ed59b3273e51efaa8bdab0c7e19de5f0`。
每題一步一行、最終答案加底線；MC 最後一行寫出選項字母（D 就寫 `\underline{D}`）。
依據是 `reference/ans_pages/ans_01–17.png`（全頁）＋ `reference/ans/` 紅框裁圖；每題數值都與 ANS 紅字核對過。

### ANS 只有答案、沒有步驟的題（步驟由我重建，數值照 ANS）

| 題 | ANS 只寫 | 我用的方法（自己重算一次） |
|---|---|---|
| q1 | `Transverse wave` | 粒子振動方向 ⟂ 傳播方向 |
| q2 | `2 cm` | 圖格 1 格 = 4 cm，波峰在半格 → ½×4 |
| q4 | `8 cm` | 相鄰波峰 2 格 × 4 cm |
| q7 | `D`（圖上 λ=6 cm） | 圖上已印 λ 與 A |
| q9 | `0.8 s` | 兩個 snapshot 相隔 0.1 s：波前進 1 cm（由 key 的 0.8 s 反推，非圖上量）→ v=10 cm/s，λ=8 cm → T=0.8 s |
| q11 | `C` | v = fλ = 5 × 0.2 |
| q12 | `B` | f = 12/4 = 3 Hz，λ = 0.12 m |
| q18 | `C` | 波峰到波谷 = T/2 = 2 s → T = 4 s |
| q19 | `B` | 1 s 內至少 0.5λ |
| q20 | `C` | 圖上 A 到 B = 2λ = 10 cm → λ = 5 cm，v = 10 cm / 3 s |
| q24 | `D` | 只有 R 正向平衡位置移動 |
| q25 | `C` | R 位移向下、速度向上 |
| q26 | `B` | P 第二次過平衡位置時波行了 18 cm / 1.5 s |
| q27 | `D` | P 與 R 相差 π<θ<2π |
| q28 | `A` | 波左移後 P 向上、Q/S 同向、R 向下 |
| q6 | `D` | C 與 G 同位移同方向 |

### 與 ANS 不一致／要標註的地方（沒有吞掉）

1. **q29(d)**：ANS 的草圖由 0 開始，但印刷圖把 **A 印在波峰**；s–t 圖必須由 +A 開始（cosine）。
   我寫「由波峰開始、0.125 s 到波谷」，entry 內加 `note()` 寫明老師草圖由 0 開始。
   physics-lead 裁決：**ANS 錯，ebook 的寫法對**。同一題 ANS 的 (b) 草圖（A 在波谷、C 在波峰）與「A 在波峰」一致。
2. **q9**：ANS 只寫 `0.8 s`。主步驟改為**由答案反推**：「$0.1$ s 內波前進 $1$ cm（由 key 的 $0.8$ s 與 $\lambda = 8$ cm 推得）」。
   `note()` **不要寫任何波峰位移的數字**（例如「只差 0.75 cm」）：physics-lead 2026-11-26 撤回該數字，理由見下文
   「我裁決 ebook 標出的 4 處」第 2 條。note 只講「the printed curves are hand-drawn」。不要叫學生在圖上量。
3. **q20**：ANS 沒有步驟；用 A–B = 2λ（三個波峰）才得到 f = 0.667 Hz（若當 1.5λ 會得 0.5 Hz，與 ANS 不符）。
4. **q24**：ANS 紅框寫「$Q$ is almost at its peak」，但圖上 **$Q$ 在谷底**（最大負位移）。已改成 trough，
   並加 `note()` 寫明紅框寫 peak、結論（R 先、Q 次、P 最後）不變。
5. **q31(c)**：講明**由 $t = 0$ 起計** $0.4$ s $= 2T$、波形前進 $2\lambda$；另加一句：老師紅框圖比的是
   $t = 0.3 \to 0.4$（$\Delta = T/2$），圖上只移 $\lambda/2 = 4.8$ cm，免得學生以為圖上要移 $2\lambda$。

### 開頁（`space`）：29 題，共 3,056 pt

| 題 | pt | 題 | pt | 題 | pt |
|---|---|---|---|---|---|
| q2 | 44 | q13 | 194 | q24 | 144 |
| q3 | 76 | q14 | 145 | q25 | 130 |
| q5 | 104 | q15 | 136 | q26 | 89 |
| q7 | 63 | q16 | 123 | q27 | 111 |
| q8 | 80 | q17 | 147 | q28 | 237 |
| q10 | 43 | q18 | 33 | q29 | 236 |
| q11 | 35 | q19 | 47 | q30 | 85 |
| q12 | 71 | q20 | 147 | q32 | 50 |
| q21 | 110 | q35 | 24 | q36 | 151 |
| q22 | 96 | q23 | 105 | | |

pt 值 = `check_book` 報「還差幾多 pt 才全部顯示」+ 4 pt 餘量。切口都落在已驗過的全寬空白行（`region[3]`）。

頁高變化（原 841.9 pt）：p02 961.9、p03 945.9、p04 984.9、p05 1184.9、**p06 1392.9**、p07 1178.9、
p08 1042.9、**p09 1552.9**、p10 1077.9、p11 926.9、p13 891.9、p16 865.9、p17 992.9。
p06／p09 係 32 題中最長（多題都要開頁），若嫌太長可以改為卡片題，等 Chief 決定。

### 卡片（`answerCards`）：q1、q6、q9

三題全頁冇合法切口（見上面 stage 1 的驗證），開不到 `space`：
q1 region 只有 22×158、q6 28×184、q9 90×190，答案分別要多 61／100／133 pt。
q1 更連一粒控制鍵都放唔落（`check_book` 報 `finger tap on q1 did not reveal one step (0 → 0)`）。
所以這三題改用 `answerCards`（工作紙式：頁面不動，答案開卡）。

### 驗收

- `node tools/qa/check_book.mjs jpwm01` → **`OK no blocking problems`**（0 FAIL 0 WARN；q24 加 `note()` 後長高 51 pt，
  space 89 → 144，切口仍在 189.5，JPG 上全頁寬 0 墨）
- `python tools/qa/check_answer_chips.py jpwm01` → `jpwm01: 3 chips, PASS`
- `solutions.js` 18,069 bytes、md5 `772c7f310ed951937f074bcf2ccdca35`（三處修正後）

### 與 physics-lead 核對表的對齊（2026-11-26 補）

physics-lead 的逐題核對表已補在本文件下面「內容核對（physics-lead）」一節。上表（ebook 自己重建的步驟）
逐題與它對過，4 處分歧的裁決見該節「我裁決 ebook 標出的 4 處」。**三處已在 2026-11-26 落進 `solutions.js`**：
q9（改成由答案反推；`note()` 只講印刷曲線手畫，**不寫 0.75 cm**——該數字已撤回）、q24（peak → trough + `note()`）、q31(c)（講明由 t = 0 起計，並補紅框圖只移 λ/2）。
q29(d) 依 physics-lead 裁決保留 ebook 的寫法（ANS 錯）。

## 內容核對（physics-lead，2026-11-26）

**讀了什麼**：ANS 17 頁全讀（`reference/ans_pages/ans_01–17.png`）＋ 33 個紅框／9 個紅字叢集（`reference/ans/`）
＋ 我另外 render 的 20 張 6–18× 放大圖（`_jpwm_zoom/`，untracked）。ANS 的紅答案一半是打字（有 text layer），
我用 PyMuPDF 逐 span 抽（紅 = R>216、G<38、B<38），共 613 行文字、61 個紅 span；另一半（q29–q36 的圖）是手畫，逐張看。
`extract_ans_refs.py` 漏了 p2 的「2 cm」與 p3 的「D」（寬 <30 pt，被當雜點），我由 text layer 讀回。

**量測限制（照實講）**：q2 的格紙振幅、q9 的兩個 snapshot 位移、q19 的 A 高度，掃描圖量唔到比 ±0.3 cm 更好，
原因寫在該題；其餘 λ、T、v 與格數都用 pt／px 自己量，數字在表內。

| 題 | ANS 實際印了什麼 | 物理重算 | printed worked example | 誤導風險／teacher note |
|---|---|---|---|---|
| q1 | 紅字 `Transverse wave`（Answer 框內） | 弦上波，粒子振動 ⊥ 傳播 → 橫波 ✓ | 冇 | 唔好因「手握弦」當 longitudinal。note：transverse = oscillation perpendicular to propagation。 |
| q2 | 紅字 `2 cm` | amplitude = 波峰離平衡線的距離；ANS 2 cm，概念 ✓。圖上格數我量唔到（±0.5 cm），不報圖數 | 冇 | 學生會答 4 cm（crest-to-trough）。note：amplitude is measured from the equilibrium position, not between a crest and a trough。 |
| q3 | 紅字 `D`（右邊紅框） | 同一列波所有粒子振幅相同；Q、R、S 與 P 一樣 ✓ | 冇 | 「same amplitude」≠「same displacement」：Q、R 在平衡位置、位移 0，但振幅仍是 A。 |
| q4 | 紅字 `8 cm` | 圖上 4 cm = λ/2 → λ = 8 cm ✓（2026-11-26 重量：格線間距 **27.5 pt**（p03 共 12 條，x 222.88–526.0，間距 27.4–27.8），**粗細只有一種、中間冇細格線**；4 cm 比例尺 = **2 格** → 1 格 = **2 cm**；粒子 3→11 = 4 格 = 110 pt = 8 cm ✓；振幅 1 格 = 2 cm ✓。舊寫「4 cm 箭咀 38.4 pt、1 個間距 9.6 pt、1 細格 = 1 cm」全部作廢——1 cm 只是半格，印刷圖沒有畫出半格線） | 冇 | 4 cm 是半個波長（zero→zero），不是 crest→crest。note：half a wavelength = 4 cm, so λ = 8 cm。 |
| q5 | 紅字 `D`（右邊紅框） | A 與 D 是相鄰波峰 → AD = λ ✓；AC = λ/2、DE = λ/2、CD = λ/4 | 冇 | A 畫在左端波峰（半個波峰被裁），學生會當 A 是零點。note：A and D are successive crests。 |
| q6 | 紅字 `D`（右邊紅框） | C→G：同位移、同運動方向的相鄰兩點 → 1λ ✓；A→C = λ/2、A→G = 3λ/2 | 冇 | 「one wavelength」用同相點定義，不一定要由波峰起。note：C and G are successive points with the same phase。 |
| q7 | 紅字 `D`；圖上紅字 `λ = 6 cm`、`A = 1.5 cm` | 由格紙讀 λ = 6 cm ✓ | 圖上紅筆標了 λ 與 A（半個 worked example） | 多數一格會得 4 cm（選項 C）。 |
| q8 | 紅字 `B`；紅框 `Answer is B. The amplitude is A = 1.5 cm.` | A = 1.5 cm ✓（波峰離平衡線 1.5 cm；crest-to-trough 3 cm） | 紅框一句 | 學生會答 3 cm（peak-to-peak）。 |
| q9 | 紅字 `0.8 s`（Answer 框）；另有紅箭嘴指住 t=0 曲線 particle 3 的波峰 | λ = 8 cm（4 cm = 半個波長）；0.1 s 內波前進 1 cm → v = 10 cm/s → T = 8/10 = 0.8 s ✓；「crest 在 0.8 s 後在哪」= 一個週期後回到原位（particle 3） | 冇 | 波峰位移**唔報數字**（我 2026-11-26 撤回 0.75 cm；量測方法與限制見裁決第 2 條：粗略、±1 pt、不入書）。note：in 0.1 s the wave advances 1 cm (from the key's 0.8 s)。 |
| q10 | 紅字 `T = 0.5 s`、`F = 1/T = 2 Hz` | 圖中 1 s 內 2 個完整振盪 → T = 0.5 s、f = 2 Hz ✓ | 紅字兩行（先 T 後 f） | 只數到 1 個振盪會答 T = 1 s。note：the axis ends at t = 1 s and shows two cycles。 |
| q11 | 紅字 `C`（右邊紅框） | v = fλ = 5 × 0.2 = 1 m/s ✓ | 冇 | 0.2 m 已是 SI，唔好再 ×100。 |
| q12 | 紅字 `B`（右邊紅框） | 12 次 / 4 s → f = 3 Hz；兩個相鄰波谷 = λ = 0.12 m → v = 0.36 m/s ✓ | 冇 | 把 4 s 當 period（T = 4/12）。note：12 vibrations in 4 s gives the frequency, not the period。 |
| q13 | 紅字 `B`（右邊紅框） | 圖 (a) x = 一個波長（兩個同相零點）、圖 (b) z = 一個週期 → v = λ/T = x/z ✓ | 冇 | y 是振幅（distractor）；C 的 z/y 量綱錯。note：check units — x/z is m s⁻¹。 |
| q14 | 紅字 `A`；紅框寫 (1)✓ (2)✓ (3)✗ | 圖 λ = 20 cm = 0.2 m；v = 1.2 m/s → f = 1.2/0.2 = 6 Hz ✓；A = 3 cm（不是 6 cm）→ A（(1)(2) only）✓ | 紅框三點（完整） | (3) 的 6 cm 是 peak-to-peak。note：convert λ to metre before v = fλ。 |
| q15 | 紅字 `B`；紅框 `B / (1) Cannot be determined / (2) f = 1/0.8 = 1.25 Hz / (3) A = 2 cm` | T = 0.8 s → f = 1.25 Hz；A = 2 cm；單一粒子 s–t 圖不能定傳播方向 → B（(2) only）✓ | 紅框（完整） | (1) 是陷阱：s–t 圖冇波向。note：a displacement-time graph of one particle cannot tell the direction of travel。 |
| q16 | 紅字 `A`；紅框 `λ = 0.6 m / T = 2×10⁻³ s / f = 500 Hz / v = (0.6)(500) = 300 m/s` | 圖 (a) 波峰 0 → 0.6 m → λ = 0.6 m；圖 (b) 0.5 與 1.5 是過零點（中間 1.0 是波谷）→ T = 2 ms → f = 500 Hz → v = 300 m/s ✓ | 紅框（完整） | 把 0.5／1.5 當波谷會得 T = 1 ms、v = 600（冇呢個選項）。note：0.5 and 1.5 ms are zero crossings, not troughs。 |
| q17 | 紅字 `D`；紅框 `1.75λ / 0.30 + 1.75×0.45/3 = 0.5625 m / t = 0.5625/0.5 = 1.125 s` | 0.45 m = 3λ → λ = 0.15 m；波前在軟木 0.30 m 外，波前是向下過零（trough 在後）→ 軟木先向下；第一次最高 3T/4、第二次 7T/4；距離 0.30 + 1.75λ = 0.5625 m → t = 1.125 s ✓ | 紅框（完整） | 「第二次」最高才是重點。note：the cork moves down first; the second crest reaches it 1.75λ after the front。 |
| q18 | 紅字 `C`（右邊紅框） | λ = 20 m；crest→trough 2 s = T/2 → T = 4 s → v = 5 m/s ✓ | 冇 | 4 m 是 2A（與速度無關）；20/2 = 10 是選項 D。note：the 4 m drop is twice the amplitude and is not used。 |
| q19 | 紅字 `B`；紅框 `minimum distance ... is 0.5λ ... minimum possible frequency is 0.5 Hz` | 1 s 內最小位移 0.5λ → f_min = 0.5 Hz ✓ | 紅框兩句 | 圖中 A 兩次都畫在軸上方，但 0.5λ 位移應令 A 的位移反號；答案靠「crest-then-trough 變 trough-then-crest」。note：compare the shape, not A's height。 |
| q20 | 紅字 `C`（右邊紅框） | A、B 都是波峰，圖中 A→B 有 2 個完整波 → 10 cm = 2λ → λ = 5 cm = 0.05 m；v = 10 cm / 3 s = 0.0333 m/s；f = v/λ = 0.667 Hz ✓ | 冇 | 當 A→B = 1λ 會得 f = 0.333（選項 A）。note：count carefully — there are two full waves between A and B。 |
| q21 | 紅字 `C`；紅框 `λ = 8×2 = 16 cm / v = 0.02/0.05 = 0.4 m/s / f = 0.4/0.16 = 2.5 Hz` | λ = 16 cm；v = 2 cm / 0.05 s = 40 cm/s；f = 40/16 = 2.5 Hz ✓ | 紅框（完整） | 把 λ 讀成 8 cm 會得 5 Hz（選項 B）。note：16 cm is eight 2 cm gaps；cm→m 要換。 |
| q22 | 紅字 `(i) A, E / (ii) C, G / (iii) B, D, F` | 波向左：上升段粒子向上、下降段向下；波峰波谷瞬時靜止 → ✓ | 冇 | 用「把波向左移少少」看，不要背口訣。note：shift the wave a little and read each particle。 |
| q23 | 紅字 `(i) A&E, B&F, C&G / (ii) 12 對 / (iii) A&C, A&G, B&D, C&E, D&F, E&G` | A=0、B=λ/4、C=λ/2、D=3λ/4、E=λ、F=5λ/4、G=3λ/2；同相 3 對、antiphase 6 對、其餘 12 對 ✓ | 冇 | 書內 Phase 框定義「out of phase = 非整數 λ」，antiphase 屬 out of phase；但 ANS 把 (ii) 只列 12 對、antiphase 另列 (iii)。note：(ii) 要寫 "out of phase but not antiphase"，否則與定義框矛盾。 |
| q24 | 紅字 `D`；紅框 `Only R is moving towards the equilibrium position ... Q is almost at its peak ...` | 波向右：R 在上升段、向下（向平衡）；Q 在波谷（瞬時靜止）→ T/4；P 在下降段、向上（離開平衡）→ 最長。次序 R, Q, P ✓ | 紅框（完整） | 紅框寫「Q is almost at its peak」，但 Q 在谷底（最大負位移）。note：Q is at the trough, not the peak。 |
| q25 | 紅字 `C`；紅框 `P momentarily at rest ... R's displacement is downwards but its velocity is upwards ...` | 波向左：R 在上升段、位移向下但速度向上 → 位移與速度相反 ✓ | 紅框（完整） | 「velocity」是粒子運動方向（上／下），唔係波向。note：velocity here means the particle's direction of motion。 |
| q26 | 紅字 `B`；紅框 `the wave has travelled 18 cm when particle P just passes the equilibrium position for a second time ... 18 ÷ 1.5 = 12 cm/s` | 圖 λ = 24 cm（波峰 0 與 24）；P 在 t=0 是波峰，第一次過平衡 T/4、第二次 3T/4 = 1.5 s → T = 2 s → v = λ/T = 12 cm/s ✓（= 18/1.5） | 紅框（完整） | 「第二次」= 3T/4；18 cm 是波行的距離，不是 P 行的距離。note：the second zero crossing is at 3T/4。 |
| q27 | 紅字 `D`；紅框 `The phase difference θ between P and R is in the range of π < θ < 2π.` | P 在上升段而向下 → 波向右（A 對）；Q 在下降段 → 向上（C 對）；全部同振幅（B 對）；R 與 P 不是整數 λ 相差 → 不同相，D 錯 ✓ | 紅框（完整） | 「incorrect」題要逐項驗；π<θ<2π 講法少見，建議「R and P are not separated by a whole number of wavelengths」。 |
| q28 | 紅字 `A`；紅框 `After a while, the wave would shift to the left ... (1)✓ (2)✗ (3)✗` | 波向左：P 向上 ✓；Q 與 S 同向（不是相反）✗；R 向下（不是靜止）✗ → A（(1) only）✓ | 紅框（完整） | 用波向左移的虛線圖判斷。note：use the dotted curve (shifted left)。 |
| q29 | (a) 紅框 `T = 0.25 s / f = 1/0.25 = 4 Hz / v = 4×0.8 = 3.2 m s⁻¹`；(b) 手畫曲線（A 在波谷、B 過零上升、C 在波峰、D 過零下降）；(c) 紅框 sine（由 0 向下：A 谷、B 零、C 峰、D 零）；(d) 紅框曲線由 0 向下 | (a) ✓；(b) T/2 後：A 谷、B 零上升、C 峰、D 零下降 ✓；(c) 0.375 s = 1.5T，與 T/2 同相 ✓；(d) A 在 t=0 是波峰，s–t 應由 +A 開始 → **ANS 畫錯起點** | (a) 印刷完整；(b)(c)(d) 手畫 | (d) 見「我裁決」第 1 條。note：A starts at a crest, so s starts at +A。 |
| q30 | 紅框 `(a)(i) λ = 9/2.25 = 4 cm / (ii) T = (7−3)/5 = 0.8 s, f = 1.25 Hz / (iii) v = fλ = 5 cm/s, s = vt = 5×3 = 15 cm`；`(b)(i) Q (ii) S`；(c) 紅框畫出新波形（右移 λ/4）與 S 的新位置 | λ = 4 cm；T = 0.8 s、f = 1.25 Hz；v = 5 cm/s；S 在 t=3 起振 → 15 cm ✓；T 在 t=7 是向下過零，Q 同向（上）、S 反向（下）✓；(c) 波形右移 λ/4 = 1 cm，S 新位置在軸下 ✓ | 紅框完整（a、b）＋(c) 圖 | 「mark the position of S」= 同一 x 的新位移（S 不會水平移動）。note：S moves vertically only。 |
| q31 | 紅框 `(a)(i) 1¼λ = 12 cm, λ = 9.6 cm / (ii) 1.5λ = 0.144 m, v = 0.48 m/s`；`(b) up: c / down: a, b, e / rest: d`；(c) 紅框 t=0.4 與 t=0.3 兩條曲線；(d) 格紙圖（0→0.5 s） | λ = 9.6 cm；0.3 s 行 1.5λ → v = 0.48 m/s、T = 0.2 s ✓；b 在波峰前（上升段）→ 向下 ✓、d 在谷底 → 靜止 ✓；0.4 s = 2T，波形與 t=0 同相、比 t=0.3 移 λ/2 ✓；d 在 0.25 s 起振 ✓ | 紅框完整（a、b、c、d） | b 唔係波峰（波峰冇 label）。note：b is just before the crest, so it moves downwards。 |
| q32 | 印刷完整解答連 (1M+1A)：`(a) 2×2 = 4 s`；`(b)(i) 0.25 Hz (ii) 0.15 m/s (iii) 4 cm (iv) 0.6 m`；`(c) 0.75λ`；`(d) 0`；(e) 兩條 s–t 曲線 | T = 4 s、f = 0.25 Hz、v = 0.15 m/s、A = 4 cm、λ = 0.6 m、0.75λ、B 位移 0 ✓ | 印刷完整（有 marking scheme） | (d) 的 B 在波到之前也是 0，所以答案穩健。note：the wave reaches A at t=0 and B at t=3 s。 |
| q33 | 印刷完整：`(a) λ = 0.9/1.5 = 0.6 m / v = 0.9/0.6 = 1.5 m/s / 2.2 s 行 3.3 m = 5.5λ / P 在 2.4 m = 4λ` ＋波形圖；`(b) 到 P 需 2.4/1.5 = 1.6 s；P 由 1.6 到 2.2 s 完成 1.5 次振盪` ＋圖 | λ = 0.6 m、v = 1.5 m/s；2.2 s 行 3.3 m = 5.5λ；P 在 2.4 m；1.6 s 到 P；1.6→2.2 s = 1.5T ✓ | 印刷完整 | (a) 波形要畫到 5.5λ（3.3 m），唔係只畫到 P。note：the wave extends 3.3 m from the source。 |
| q34 | 紅框 `(a) v = 0.24/6 = 0.04 m/s / (b) T = (12−6)/1.5 = 4 s, f = 0.25 Hz, λ = 0.16 m / (c) Momentarily at rest`；(d)(e) 圖 | v = 0.04 m/s；T = 4 s、f = 0.25 Hz、λ = 0.16 m；X 在 t=9 是波谷 → 瞬時靜止；Y 在 8 s 起振 ✓ | 印刷完整 | (d) Y 的圖由 8 s 起（波到才動），唔是由 0。note：Y stays at rest until the wave reaches it at 8 s。 |
| q35 | 紅框連 (1A)/(1M)：`(a) Longitudinal wave`；`(b)(i) E (ii) A and I (iii) C and K`；`(c) E–I = λ/2 → λ = 2×20 = 40 cm`；`(d)(i) 5 Hz (ii) 2 m/s (iii) 4 cm`；(e) 圖（C 回平衡、E 向右 4 cm） | λ = 40 cm（E→I 4 個間距 = 20 cm）；f = 5 Hz；v = 2 m/s；A = 4 cm ✓；C、K 在最大位移 → 靜止；E 是壓縮中心 ✓；(e) T/4 後 C 回平衡、E 到 +4 cm ✓ | 印刷完整（有 marking scheme） | 壓縮中心（E）的粒子在平衡位置、速度最大，不是靜止。note：particles at the centre of a compression are at equilibrium and moving fastest。 |
| q36 | 印刷答案：`(a)(i) 4 cm (ii) 40 cm`；`(b) c: Right, e: At rest, f: left`；`(c) f = 5/0.4 = 12.5 Hz`；`(d) T = 1/12.5 = 0.08 s, time = T/4 = 0.02 s`；(e) 紅點新位置；(f) 紅線圖 2 個週期 | A = 4 cm、λ = 40 cm；f = 12.5 Hz、T = 0.08 s、T/4 = 0.02 s；e 在最大位移 → 靜止；c 向右、f 向左 ✓；(e) 0.04 s = T/2 → 位移全部反號 ✓；(f) 0.16 s = 2T ✓ | 印刷完整 | 三行是同一批粒子在不同時刻（顯示用）；紅點是同一個 y 列的水平位移。note：at T/2 every displacement is reversed。 |

### 老師印了完整解答的題（solutions.js 要跟它的寫法與給分位）

- **連 marking scheme（1M+1A）**：q32（a–e）、q35（a–e）、q36（a–d）；q30（a、b）紅框亦逐點給分。
- **完整步驟（紅框打字）**：q14、q15、q16、q17、q19、q21、q24、q25、q26、q27、q28、q29(a)、q31（a–d）、q33（a–b）、q34（a–e）。
- **只有答案（步驟要自己建）**：q1–q6、q7（圖上紅字 λ、A）、q8（一句）、q9、q10（兩行）、q11–q13、q18、q20、q22、q23。

### 我裁決 ebook 標出的 4 處

1. **q29(d) 起點**：**ANS 錯，ebook 的 +A 寫法對。** A 在 t=0 印在波峰（t=0 圖上 A 的 dot 在 crest），所以 s–t 圖必須 s(0)=+A、0.125 s 到 −A、0.25 s 回 +A、0.375 s 到 −A。ANS 紅框的曲線由 0 向下，等於把 A 當成過零點；同一題 (b) 的「A 在波谷」反而與 +A 出發一致（T/2 後 −A）。solutions.js 保留 `note()` 說明老師草圖起點錯。
2. **q9 位移**：**ANS 的 0.8 s 正確；「波峰只差 0.75 cm」這個數字我在 2026-11-26 撤回，不要寫進書。**
   撤回理由（照實講）：我第一次報 7.1 pt、文件寫 7.2 pt，兩個都是我自己的 automated trace，但我今日重跑同一支 script（`_jpwm_q9.py`）得到的是 32 個候選波峰，不是一對；再收窄到 particle 3 附近時，`topmost dark pixel` 一直撞到三個東西——(i) 印在波峰正上方的 digit `3`（y≈602–608）、(ii) 兩條粗橫規（t=0 在 y=602.9、t=0.1 在 y=693.2～693.7）、(iii) 老師畫的虛線 marker。所以 7.1／7.2 不是「量到的波峰距離」，是壞 trace，唔可以重算。
   我改量到的、可以講的（**粗略，±1 pt，只用來核對量級，不入書**）：(a) 用 opening + 去橫規的方法，t=0.1 手畫曲線的波峰在 x ≈ 341.7 pt，t=0 的 crest 在 particle 3 ≈ 330.1 pt（那條正是一條粗格線，x=330.08），位移 ≈ 11.6 pt；(b) q9 自己那張圖的格線：10 條，x 260.8、283.9、306.8、330.1、353.3、376.3、399.5、422.5、445.8、468.8，間距 **23.0–23.3 pt**，**同樣只有一種格線（冇細格）**，1 格 = 2 cm → 1 cm = 11.55 pt；(c) 11.6 pt ÷ 11.55 pt/cm = **1.00 cm**。三個數字都來自 p04 同一張圖。
   **這不是獨立驗證**：(c) 是同一張圖的同一個比例再除一次，誤差會疊在一起；所以 1.00 cm 只可以當「量級對得上 ANS 的 1 cm／0.8 s」，不可以當「量到 1.00 cm」寫進書，也不可以寫給 verifier 當基準。全書只保留這一個版本。
   **舊的「1 cm = 9.6 pt」錯在哪**：那是 q4（粗格 27.5 pt）被我量成 38.4 pt 之後的比例，q4 與 q9 是兩張不同大小的圖（27.5 pt vs 23.1 pt 粗格），不能互相搬；q4 那個 38.4 pt 已作廢（見上表 q4 列）。
   落書的做法：解法寫「0.1 s 內波前進 1 cm（由 key 的 0.8 s 與 λ = 8 cm 推得）」，`note()` 只講印刷曲線係手畫；**唔寫 0.75 cm、唔叫學生在圖上量**。原本 ANS 的「1.0–1.2 cm」也一併不採用（ANS 只寫 0.8 s，那個 cm 數字是 ebook 自己讀圖的）。（以前用來校準的「1 cm = 9.6 pt」是 q4 那張圖的箭咀長度，q9 是另一張圖、另一個比例，不能搬過來。）
3. **q20 A–B = 2λ**：**正確。** A、B 都是波峰，兩者之間還有一個波峰（圖上是 A、中間一個、B），即 2 個完整波 = 2λ = 10 cm → λ = 5 cm → f = 0.667 Hz。若當 1.5λ 會得 f = 0.5 Hz，與 ANS 的 0.667 不符。
4. **q31(c) 照寫**：**正確，但要補一句。** 0.4 s = 2T（T = 0.2 s），由 t=0 起計波形前進 2λ；紅框圖比較的是 t=0.3 → t=0.4（Δ = T/2），所以圖上只移 λ/2 = 4.8 cm。solutions.js 寫「0.4 s = 2 periods」時要講明是「由 t=0 起計」。

### q16 時間軸：我裁決 verifier 的 150 m s⁻¹（2026-11-26 晚，**標籤位置待第三次讀數**）

**裁決：A（300 m s⁻¹，T = 2 ms）。ANS 與 `solutions.js` 不用改。**
**狀態（Chief 指示）：下面「第二峰落在 1.5 與 2.5 兩標籤中點」這句只是暫定，未定論。** 未決的是標籤位置：verifier 量 `1.5`→`2.5` = 92–93 px、我量 68–77 px。第三次讀數（ebook，`pages/p06.jpg`）回來之前，本節的最終判詞只用三件站得住的：**(1) 圖 (a) 讀到的 λ = 0.6 m；(2) key 的 T = 2 ms；(3) 時間軸標籤與曲線是否同比例（未定）**。
**兩方一致的只有曲線**：我量過零點 349.6／382.1／413.7 pt = 1049／1146／1241 px（3.000 px/pt），verifier 量 1053／1147／1242 px——兩者相同（≤4 px）。分歧全在標籤中心怎麼定（我用「字形 bbox 的左緣與右緣之中點」，verifier 用數字中心／可能取到別的間距）。

verifier 讀成「谷在 0.5、零交點近 1.5、峰近 2.5 → T = 4 ms → B」。我自己量 p06 圖 (b)（PDF render Z=8，去橫規用 row coverage>60%）：

| 圖上特徵 | x（pt） |
|---|---|
| 起點 = 第一個波峰（在 y 軸上） | 332.9 |
| 第一個過零點（向下） | 349.6 |
| 谷 | ≈366 |
| 第二個過零點（向上） | 382.1 |
| 第二個波峰 | 397.2 |
| 第三個過零點（向下） | 413.7 |
| 曲線終點 | ≈428 |

**曲線本身**：半週期 = 382.1 − 349.6 = 32.5、413.7 − 382.1 = 31.6（平均 32.05）；四分之一週期 = 15.1–16.7（平均 16.1 pt）。三個過零點等距（差 0.9 pt），兩個波峰相距 64.3 pt = 2 個半週期——這一組數字兩方都量到。
**印刷標籤**（軸下方字形群，我的定義：bbox 左緣與右緣的中點）：`0.5` x 355.7–365.2（中心 360.5）、`1.5` x 382.0–390.3（中心 386.2）、`2.5` x 403.9–413.7（中心 408.8）；中心距 25.7 與 22.7 pt（左緣距 26.3 與 21.9）。**這一組與 verifier 的 92–93 px（=31 pt）不合，等 ebook 第三次讀數再定。**
**按我的讀數，兩者相差 6–10 pt（≫3 px）→ 圖不符比例；按 verifier 的讀數（92–93 px = 31 pt），兩者只差 1.5 pt → 同一個比例。所以「圖不符比例」這句要等第三次讀數，暫時唔寫成定論。**

**A 在兩個分支下都成立**：
- 若最終讀數是標籤 31–31.5 pt 相距（≈ 半週期 32.05）→ 軸與曲線同比例，`0.5` 與 `1.5` 各對一個過零點，1.0 ms = 半個週期 ⇒ T = 2 ms ⇒ f = 500 Hz ⇒ v = **300 m s⁻¹（A）**。
- 若最終讀數是 22.7–25.7 pt（我的讀數）→ 圖不符比例，A 就只靠 λ = 0.6 m（圖 (a)）＋ key 的 T = 2 ms，加上曲線本身「兩個波峰、三個過零點」的次序（T = 4 ms 的話下一個波峰會在 4 ms，而曲線在 x≈428 ≈ 2.7 ms 就終止，圖上沒有那個峰）。

（暫定的第三條理由——「第二峰 397.2 落在 `1.5` 與 `2.5` 中心的中點 397.5」——只有在我的標籤讀數成立時才有效，所以**未定論前不可寫進書**。）

**0.5 與 1.5 是過零點，不是谷／峰**：谷最深處 y≈530（比軸低約 15 pt）在 x≈366，不在 `0.5` 的中心 360.5；`0.5` 這個標籤被排版往右推開，才貼近谷。教師 note：不要叫學生量這條時間軸，用標籤數字。

**換成 reader 真正播的 `pages/p06.jpg` 像素**（1786 px ÷ 595.32 pt = **3.000 px/pt**，量到）：四分之一週期 15.1–16.7 pt = **45–50 px**（平均 48.3）；半週期 32.05 pt = **96.2 px**；**按我的讀數**標籤 `1.5`→`2.5` 中心距 22.7 pt = **68.1 px**（左緣 21.9 pt = 65.7 px）、`0.5`→`1.5` = **77.1 px**（verifier 讀到 92–93 px，差 24 px，待第三次讀數）。第二峰 397.2 pt = **1191.6 px**。

### q35 (b)(iii)：我裁決「at rest」是 C, G, K（2026-11-26 晚）

3Dwork 量到 t=0 時 |v_p| = 0 的是 **C、G、K**，但印刷答案冊 (b)(iii) 只寫「Particles C and K」。我自己量印刷圖（QUE p16，PDF render Z=8，上下兩行點的中心 x）：

| 粒子 | 平衡位置 x | 即時位置 x | 位移（pt） | 位移（cm，1 cm = 5.56 pt） |
|---|---|---|---|---|
| A | 94.44 | 94.50 | +0.06 | 0.0（節點） |
| B | 121.69 | 138.56 | +16.87 | +3.03 |
| **C** | 149.56 | 171.62 | **+22.06** | **+3.97（最大）** |
| D | 176.81 | 193.69 | +16.88 | +3.04 |
| E | 204.69 | 204.69 | 0.00 | 0.0（節點，壓縮中心） |
| F | 232.62 | 215.75 | −16.87 | −3.03 |
| **G** | 260.56 | 237.75 | **−22.81** | **−4.10（最大）** |
| H | 287.75 | 271.56 | −16.19 | −2.91 |
| I | 314.94 | 315.69 | +0.75 | +0.1（節點，疏部中心） |
| J | 342.81 | 359.75 | +16.94 | +3.05 |
| **K** | 370.81 | 392.81 | **+22.00** | **+3.96（最大）** |

1 cm = 5.56 pt 是由平衡位置點距 27.8 pt = 5 cm 定出；三個極值的絕對值 3.97／4.10／3.96 cm 與答案 (d)(iii) 的 A = 4 cm 互相印證 ✓。

**判定：ANS 的 (b)(iii) 漏了 G。** G 的位移 −4.10 cm 就是 −A（最大位移，疏部那一側），粒子在最大位移時瞬時靜止，所以正解是 **C, G, K**。（(i) E、(ii) A and I 都對：E 是節點且兩側間距 11.0 pt ≪ 平衡 27.8 pt = 壓縮；(ii) A、I 是節點且間距 44.1 pt > 27.8 pt = 疏部。）

**落書做法**：`solutions.js` 的 q35 (b)(iii) 寫 **C, G, K**，並加 `note()`：「the printed marking scheme lists C and K; G is at the maximum displacement too (−4.10 cm = −A), so it is also momentarily at rest.」唔可以只寫 C, K 而唔解釋——那等於教學生漏一個正確答案。q2／q4／q13／q32(d) 的文字修正不受影響。

### 5 題 region 的答案長度（Chief 指定）

| 題 | region（pt） | 預期答案 | 字數／行數 | 一定要圖？ |
|---|---|---|---|---|
| q1 | 158×22 | `Transverse wave` | 15 字元、1 行 | 唔需要（圖已在頁上） |
| q4 | 152×143.5 | `λ = 8 cm`＋一句「4 cm is half a wavelength」 | ~30 字元、2 行 | 唔需要 |
| q6 | 184×28 | `D（C to G）`＋一句「C and G are successive points with the same phase」 | ~45 字元、2 行（9 pt 上限） | 唔需要 |
| q9 | 190×90 | 「crest 回到原位（particle 3）」＋`T = 0.8 s`＋兩步（v = 10 cm/s、T = λ/v） | ~90 字元、4–5 行 | 唔需要文字圖；但要指明 particle 3 |
| q13 | 170×28.5 | `B（x/z）`＋一句「x = λ, z = T」 | ~30 字元、2 行 | 唔需要 |

（q4、q13 已有 143.5／28.5 pt 的合法切口，可以開 `space`；真正受限的只有 q1、q6、q9。）

### 三個跨題通病（teacher notes）

1. **amplitude ≠ peak-to-peak ≠ displacement**：q2、q3、q8、q14(3)、q15(3) 全部是同一個混淆。note 一律寫「amplitude is measured from the equilibrium position」。
2. **由一粒粒子的 s–t 圖判波向**：q15(1) 唔可以；q24、q25、q27、q28 要靠「把波形移少少」或另一粒粒子的位置。note 寫「a single particle's s–t graph cannot tell the direction of travel」。
3. **phase difference 用度數定弧度**：本書用 λ 分數（q19、q23、q30）與一次 π<θ<2π（q27）。S4 一律用 λ 分數講，唔引入 radian。

### Stage 5 widget 簽核基準（physics-lead，2026-11-26）

#### 簽核紀錄

| widget | commit | 判定 | 附帶條件 |
|---|---|---|---|
| q22 粒子運動方向 | `9e22ed5`（`widgets.js` 11,355 B／md5 `8582BC9E…`） | **PASS（物理模型、方向、七粒判定全對）** | ① 必須改字：把「fastest at the **rest** position」改成「fastest at the **equilibrium** position」（現在那句會教成「平衡位置靜止」，剛好反了）；② 建議改單位：滑桿／讀數由 `151°` 改成 `0.42T`（度數可留做副標），配合本書「相位用 λ／T 的分數」的規矩。**兩項已於 `307dfe6` 落地（第 120 行、第 105／197 行），公式未動** |
| q26 第二次過平衡 | `c17e5f0`（`widgets.js` 18,618 B／md5 `9BD48A9D…`） | **PASS（波向右、P 只上下、T/4 向下、3T/4 向上、波峰 0→6→18 cm 全對）** | 無條件 |

**q22（粒子運動方向）—— 簽核要對的四件**

1. **波向是向左**，不是向右。印刷圖上「Direction of the wave travel」的箭嘴指左（p8，y≈300–310），`solutions.js` q22 也寫 "travels to the left"。**這是這題最容易做錯的設定**：若 widget 讓波向右行，答案會變成 A、C、E 全反，同 key 的 `(i) A, E / (ii) C, G / (iii) B, D, F` 對不上。
2. **判方向的式子**（向左行，y 向上為正）：粒子的速度與波形斜率同號，v_particle = v_wave × (∂y/∂x)。等價說法（學生版，`solutions.js` 用的）：「每粒粒子走向它右邊那個波峰將帶它去的位置」。
3. **七粒粒子的判定（照印刷圖的次序，左→右）**：A 在零點、曲線向右上升 → **向上**；B 在波峰 → **瞬時靜止**；C 在零點、曲線向右下降 → **向下**；D 在谷 → **瞬時靜止**；E 在零點、曲線向右上升 → **向上**；F 在波峰 → **靜止**；G 在零點、曲線向右下降 → **向下**。
   → 同 key 完全一致：(i) A, E；(ii) C, G；(iii) B, D, F。**這七個判定就是簽核清單**，widget 逐粒顯示箭嘴時要逐粒對得上。
4. **速度大小**：波峰／波谷 = 0；過平衡位置 = 最大。widget 的箭嘴長度要反映這一點（或明寫「箭嘴長度不代表速度大小」，但不可畫成等長又聲稱有大小之分）。

**q26（第二次過平衡）—— 簽核要對的三件**

**印刷圖（p9）我逐樣看過**：P 的圓點就在 y 軸與第一個波峰的交點上（x = 0，位移 = +A），圖上是連續 sine，x 軸印 `0 / 6 / 18 / 30`（cm），「direction of travel」的箭嘴指**右**；過零點在 6、18、30 → 半個波長 = 12 cm → **λ = 24 cm**（波峰 0 → 波峰 24）。

1. λ = 24 cm、v = 12 cm/s → T = 2 s（`solutions.js` 已如此寫）。
2. P 在 t = 0 是**最大位移（波峰）**，所以過平衡位置在 **T/4 = 0.5 s 與 3T/4 = 1.5 s**；題目的「second time」= 3T/4 = 1.5 s ✓（與 key 的 12 cm/s 自洽）。**不是「再過半個週期」**（那是第三次的講法）。widget 的時間軸 0 → 1.5 s，在 t = 0.5 s 與 1.5 s 標兩次過平衡。
3. 波形前進 18 cm = 0.75λ = 1.5 s × 12 cm/s；P 的位置不要隨波水平移動（粒子只上下）。

**共通**：S4 不引入 radian；相位差一律用 λ 的分數或 T 的分數講。

### 給 visual 的圖／動畫建議（只建議，唔實作）

- **最高價值**：一個「波移少少」的通用 widget（拖時間軸 0–T），配 q22／q25／q27／q28 的粒子箭嘴 — 一次解決全章最多人錯的波向判斷。
- **q9**：動畫顯示 0.1 s 內波峰移 1 cm、0.8 s 後回到 particle 3；直接把「第二次」與「一個週期」講清。
- **q17**：軟木由靜止到第一次最高（3T/4）、第二次最高（7T/4）的動畫，配 0.30 m + 1.75λ 的距離尺。
- **q29／q31／q32／q34**：同一個「波形 + 時間軸」面板，顯示 t=0 → t=T/2 → t=T 的 profile 與指定粒子的 s–t 圖並排。
- **q35／q36**：縱波粒子列 widget，同時顯示位移箭嘴、壓縮／疏部標籤與「最大位移 = 瞬時靜止」。
- **q19**：拖 0.5λ／1.5λ 位移，顯示「最小」與「下一個可能」的差別。
- **q23**：phase pair 高亮器（點 A 再點另一粒，顯示相位差是 λ 的幾分之幾）。

### 量測限制（照實講）

- **q2**：格紙上波峰離平衡線的格數，掃描圖的軸線與 dot 對唔準，量到嘅值誤差 >0.5 cm（3× JPG 與 ANS 2× PNG 都試過），所以只核概念（ANS 2 cm）、唔報圖上格數。
- **q9**：兩個 snapshot 的波峰距離**量唔到可靠值**（原因見裁決第 2 條：digit `3` 壓在 crest 上、y=602.9 與 693.2 有粗橫規、另有虛線 marker）。只用來核對量級的粗值是 ≈1 cm（±1 pt、不入書、不是獨立驗證）；**不要寫 0.75 cm**（已撤回）。答案以 ANS 的 0.8 s 為準。
- **q19**：A 在兩個 snapshot 的高度，像素上都在軸上方；與 0.5λ 位移應反號不符，屬印刷草圖的簡化。

## 四條線（每本書都要有，缺一條就會讓錯誤過關）

| 線 | 負責 | 做什麼 |
|---|---|---|
| 製作 | `ebook`、`layout-engineer`、`visual`、`3Dwork` | 頁面、題目、解答、互動圖、動畫 |
| 內容正確性 | `physics-lead` | ANS 判讀、每題物理、widget 模型對印刷圖、會誤導學生的簡化；Stage 7 bump CACHE 前簽收 |
| 數值驗算 | `verifier` | 逐題獨立重算（先按印刷題自己算，再比 `solutions.js` 與老師 ANS），三者分歧照實寫明 |
| 畫面驗證 | `3Dwork`／`visual` | 立體示範、widget 幾何與字級、按鈕底下墨跡 |

## Log

- 2026-11-26：Chief 用 `tools/new_book.py` 開書（form S4、code JPWM01、title Nature of waves、topic Nature of waves），兩份 PDF 已入 `source/`，`extract_pages.py --scan` 出 17 頁／36 題（含一條可疑 q0）。
- 2026-11-26（ebook，`8ebb8a6`）：核 `ansPageOffset = 0`（17 頁對 17 頁、頁碼／running head／逐頁題號全同、ANS p4 與 p10 抽查為 QUE 加紅答案）；
  剔走 3 條掃描誤判（q0、p7 的刻度 `1`、p10 的列表 `1.`／`2.`）；定 4 個 sections；36 題寫入 `extract.questions`；
  跑 `extract_pages.py jpwm01` 出 `pages/`（17 張）與 `layout.json`（36 題 anchor＋region，0 MISSING ANCHOR）。
- 2026-11-26（ebook）：跟 layout-engineer 的 4 個建議值自己重量 → `footer 822 → 790`；q22 由他建議的 404.5 收到 **404.0**
  （404.5 會碰 Phase 框頂 405.00，178 px），q28 由 789.2 收到 **782.0**（789.2 會切穿 Q28 選項 C，401 px）；
  q7 → 223.0、q27 → 626.0 照落（兩者都量到合法）。footer 改細後新增三題壓墨，自己補 q1／q6／q23 的 override。
  最終 36/36 區內 0 墨、底邊 ≤790、13 條切口全寬 0 墨。
- 2026-11-26（ebook，`894cf96` 之後）：全部改量 `pages/pNN.jpg`（閱讀器真正切的圖）→ q28 782.0 在 JPG 上仍有 7 px
  （選項 C 抗鋸齒由 781.33 起），收 **780.5**；同時量到 q4 底邊可收 **531.5**（p3 全寬無墨行 531.5–694.0，102 行）、
  q13 可收 **779.0**（p5 776.0–779.0，7 行），兩題因此由「冇切口」變成可以開 `space`。
  最終：36/36 `px<170` = 0、底邊最高 785.8、13 條切口 cutpx 全 0；冇合法切口只剩 **q1／q6／q9**。
- 2026-11-26（physics-lead）：補回 stage 2 的「內容核對」節（36 題逐題：ANS 紅字、物理重算、printed worked
  example、誤導風險）。方法：ANS 17 頁全讀＋PyMuPDF 抽紅字 span（613 行、61 個紅 span）＋20 張 6–18× 放大圖；
  `extract_ans_refs.py` 漏掉的 p2「2 cm」、p3「D」由 text layer 讀回。裁決 ebook 標出的 4 處：q29(d) ANS 起點錯、
  q20 A–B = 2λ 正確、q31(c) 照寫但要補「由 t=0 起計」、q9 0.8 s 不變。只改 docs，冇碰 `solutions.js`／`book.json`／`widgets.js`。
- 2026-11-26（physics-lead，撤回）：**q9「波峰只差 0.75 cm」撤回**。重跑 `_jpwm_q9.py` 只得 32 個候選波峰（不是一對），
  收窄到 particle 3 附近時 topmost-dark 撞到 digit `3`（y≈602–608）、粗橫規（602.9、693.2～693.7）與虛線 marker，
  7.1／7.2 pt 不可重算。改用 opening＋去橫規：t=0.1 手畫 crest x≈341–342 pt、t=0 crest（particle 3）x≈330 pt、
  同圖 `4 cm` 箭咀 ≈45 pt（4 個粒子間距）→ 位移 ≈1.0 cm。**這個數只是量級核對（±1 pt、同一個像素比例的比值、不是獨立驗證、不入書）**，完整聲明與失敗原因寫在「我裁決 ebook 標出的 4 處」第 2 條；全書只保留那一個版本。
  因此 `solutions.js` 的 q9 `note()` 唔應該寫 0.75 cm；只講印刷曲線手畫。舊「1 cm = 9.6 pt」是 q4 圖的比例，不能搬到 q9。

## Stage 6 最終簽收（physics-lead，2026-11-26 晚）

**書線 commit `e14c2a4`；`solutions.js` 36 entries／18,642 B／md5 `958CAF1E08BCE9AA905137BCA2B37723`。以下每一行都是我（physics-lead）在 `e14c2a4` 的最終位元組上自己讀的，不是引用 ebook 的報告。**

| 位置（`e14c2a4`） | 判詞 | 落書原文 |
|---|---|---|
| q35 (e) 第 429 行 | **PASS** | `After a quarter of a period, $C$ is back at its equilibrium position.` |
| q35 (e) 第 430 行 | **PASS** | `At $t = 0$, $E$ is at the centre of a compression, where the particles have their maximum speed in the direction of travel — so in a quarter of a period $E$ moves a full amplitude ($4$ cm) to the right.` |
| q13 第 130 行 | **PASS** | `Figure (a) marks $x$ from a zero crossing to the one $1.5$ wavelengths further on, so $x = 1.5\lambda$.` |
| q35 (b)(iii) | **PASS** | `(iii) at rest momentarily: C, G and K` ＋ note（ANS 只印 C、K，G 是 −A 也靜止） |
| q2／q4（`77f1d8f`） | **PASS** | 只有一種格；1 格 = 2 cm、4 cm = 2 格；λ = 8 cm（文字唔再提細格） |
| q32 (d) | **PASS** | A–B = 0.75λ，由波峰起算落在平衡線 → 位移 0 |
| q29 (d) | **PASS** | s–t 由 +A 起（ANS 草圖由 0 起是錯，已加 note） |
| q16 | **PASS** | 答案 A（300 m s⁻¹）；`solutions.js` 只由 λ = 0.6 m 與 T = 2 ms 推出，**不依賴圖的比例**，所以「圖不符比例」那條只留在 docs，不入書、不擋上線 |

### q35 (e) 的物理我自己重算（不是只看文字）

用 `s = A sin(2π(t/T − x/λ))`、A = 4 cm、T = 0.2 s、λ = 40 cm（課本／答案冊數據）：

- `∂s/∂x = −(2πA/λ) cos(2π(t/T − x/λ))`。壓縮中心是 ∂s/∂x 最負處 ⇒ t = 0 時在 **x = 0**，正是 E 的平衡位置（我量到 E 兩側點距 11.0 pt ≪ 平衡 27.8 pt，壓縮 ✓）。
- 粒子速度 `v_p = ∂s/∂t = +(2πA/T) cos(...)`，在 t = 0、x = 0 為 **+ωA**：**最大**，而且方向與波向相同（波向 +x，因為相位 `t/T − x/λ` 固定時 x 隨 t 增大）⇒ 「the particles have their maximum speed in the direction of travel」成立。
- t = T/4 時，E 由 s = 0 走到 `A sin(2π(1/4)) = +A = +4 cm` ⇒ 「in a quarter of a period E moves a full amplitude (4 cm) to the right」成立。
- 同一時刻 C（t=0 時 +A）與 G（t=0 時 −A）都回到 s = 0；而壓縮中心已移到 x = λ/4 = **10 cm**，即 **G 的平衡位置** —— 所以舊句「t = T/4 時 E 在壓縮中心」錯，新版把壓縮中心鎖在 `At $t = 0$`，唔會再讀錯。

**結論：jpwm01 的內容簽收（CACHE bump 前那一關）完成。** 之後 `ebook` 的改動如再碰 `solutions.js`，要重新過一次本表。CACHE bump 與否、以及是否對外發布，由用戶決定（對外發布要用戶親口同意），我不代答。

## Stage 6 QA（ebook，2026-11-26，兩個 commit `7748c1e` 與 `e14c2a4`）

### 改了什麼
| 項 | 改動 | 依據 |
|---|---|---|
| q2 | 「1 square = 4 cm」→「2 squares = 4 cm／1 square = 2 cm／A = 1 square = 2 cm」 | 我自己量 `pages/p01.jpg`：實線格距 81.0 px = 27.0 pt（行 1989／2070／2151／2232／2314／2395）；16.5 px 那些欄只有 6–29 % 暗（實線欄 88–93 %）＝網點，唔係線，所以全頁只有一種格。4 cm 箭嘴 x 1022–1177 px = 51.7 pt ≈ 2 格（2×27.0 = 54 pt，圖畫短 6 %）→ 1 格 = 2 cm。振幅：波峰行 2070、平衡行 2151 = 81 px = 1 格 = 2 cm ✓ |
| q4 | 「2 squares × 4 cm」→「4 squares／1 square = 2 cm／4×2 = 8 cm」 | 波峰 3 到波峰 11 = 4.02 格 = 8 cm ✓ |
| q13 | x = 1.5λ、z = 1.5T；第一句改由「過零點」起算 | physics-lead 量圖 (a)：兩條虛線 302.5／387.75 pt，相距 85.25 pt = 1.509λ |
| q32 (d) | 補「A to B = 0.75λ」一句，位移 0 不變 | verifier 量到 0.75λ；0.75λ 由波峰起算落在平衡線 |
| q35 (b)(iii) | C、G、K，加 `note()` 講明 marking scheme 只列 C、K，而 G 在 −4.10 cm = −A 亦靜止 | physics-lead 裁決 `03921c3` |
| q35 (e) | 刪「each particle is at its maximum displacement」，改成「C 回到平衡位置」＋「At t = 0, E 在壓縮中心…所以 T/4 內 E 向右移一個振幅 4 cm」 | physics-lead 量到 t=0 時 E 是節點、G 是 −A 極值；壓縮中心在 T/4 移到 λ/4 = 10 cm（G 的平衡位置）。`e14c2a4`，physics-lead 在最終位元組簽 PASS |
| q32 控制條 | 把 (e) 的一句拆成三行，答案墨跡右緣由 588.89 pt 收到 495 pt | layout-engineer：條原本 590–614 pt、頁寬 595.31、`overflow-x: hidden` 只見到 5.31 pt。改後條在 497–521 pt，距頁邊 74.31 pt |

### `space`（`layout.json` 重新生成，只有下列三個值變，36 條 region 未動）
q2 44 → 68（多了一行）｜q32 50 → 84｜q35 24 → 60 → 86 → 100（(e) 拆成兩句後再量）。

### 閘（全部在 `e14c2a4` 上跑）
| 命令 | 輸出 |
|---|---|
| `node tools/qa/check_book.mjs jpwm01 --verbose` | `OK no blocking problems`（0 FAIL、0 WARN；4 個原有 WARN 已清零） |
| `node tools/qa/check_book.mjs jpwm01 --shots` | `OK no blocking problems`，截圖在 `books/jpwm01/reference/qa` |
| `node tools/qa/measure_ctl.mjs jpwm01` | `PASS: no strip covers the working`（33 題，overlapping 0） |
| `python tools/qa/check_answer_chips.py jpwm01` | `jpwm01: 3 chips, PASS` |
| `node tools/qa/_le_ctl_edge.mjs jpwm01 q32 q2 q4 q18` | q32 `clippedRight_pt -74.31`；q2 −301.31；q4 −190.31；q18 −170.31 |
| `node --check books/jpwm01/solutions.js` | OK |

最終位元組：`solutions.js` 36 entries、**18,642 B**、md5 **`958CAF1E08BCE9AA905137BCA2B37723`**（`e14c2a4`；physics-lead 已簽）。

### 接受的限制（不是缺陷，理由在此）
- **q1／q6／q9 用 `answerCards`**，頁內沒有控制條，所以 `measure_ctl` 與 `--shots` 的量測只到 33 題；三張卡另量到 158×147／184×172／190×358 pt，`pageerror 0`，逐張元素截圖看過文字與分數完整（layout-engineer）。
- **q17 的 1.75λ 前提 UNVERIFIABLE**：ANS 與 `solutions.js` 的 1.125 s 算術一致，但圖上量不到 1.75λ（verifier）。算式 PASS、前提存疑，不改答案。
- **`scrollW − clientW` 7.78 pt**：絕對定位子元素造成，不是裁字（layout-engineer 用元素截圖核對）。
- **q16 的「軸與曲線不同比例」只留在 docs**：答案 A（300 m s⁻¹）由 λ = 0.6 m 與 T = 2 ms 得出，不依賴圖的比例，所以不阻上線。

### 未做（不屬 ebook）
CACHE bump（`ebooks-v151` → `ebooks-v152`）、tag `pre-jpwm01-v152`、`build_deploy.ps1`、線上核對——Chief 負責；是否對外發布由用戶答 1／2／3。
