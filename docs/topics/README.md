# Topic registry — physics

`book.json` 的 `code` 必須等於 Uni+ 官方 physics topics list 的 Topic Code，`title` 必須等於表裡的英文名。

這個 repo 只帶**物理**那一份；數學那份在 `Tai-sura/primarymaths-ebooks` 的 `docs/topics/maths.json`。

- 60 個 topic、238 個 subtopic
- 來源 `Physics_Topics_List_Final_Checked (1).xlsx`，匯入 2026-11-26

## level-1

| code | name | grade 範圍 | topics |
| --- | --- | --- | --- |
| CH0 | Foundation | S3 | 2 |
| CH1 | Heat and Gases | S3, S4 | 5 |
| CH2 | Force and Motion | S4 | 13 |
| CH3 | Wave Motion | S3, S4 | 11 |
| CH4 | Electricity and Magnetism | S5 | 9 |
| CH5 | Radioactivity and Nuclear Energy | S5, S6 | 3 |
| CH6 | Astronomy and Space Science | S6 | 4 |
| CH7 | Atomic World | S6 | 6 |
| CH8 | Energy and Use of Energy | S6 | 4 |
| CH9 | Medical Physics | S6 | 3 |

## 檢查

```
python tools/check_topic.py jpfm08
python tools/check_topic.py --code JPWM01 --title "Nature of waves"
```

`check_topic.py` 只讀這個 repo 有的 registry，所以它檢查的是物理書，不會去問數學那份。

## 不要手改 JSON

`physics.json` 是由官方 xlsx 匯入產生的。官方表更新時，在產生 registry 的機器上跑 `tools/import_topics.py --physics <xlsx>`（該匯入器留在那台機，不在這個 repo），再把新的 `physics.json` 連同這份 README 一起提交到這裡。
