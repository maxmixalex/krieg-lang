# Automated Research UI contract

The core uses the upstream 1-based catalogue IDs. Queue row indices are 0-based.
All actions execute in country/player scope. The UI sets numeric inputs, then runs the exported ScriptedEffect handle. Actions that mutate the queue finish with `rq_update`; this refresh never grants daily progress.

| Action                                                | Inputs                             | Behavior                                                                       |
| ----------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------ |
| `rq_init`                                             | none                               | Initialize human-player defaults and current view                              |
| `rq_update`                                           | none                               | Repair queue order, refresh active lanes and row state                         |
| `rq_tick`                                             | none                               | One daily step; called by on_daily                                             |
| `rq_tree_click`                                       | `rq_t` technology ID; `rq_top` 0/1 | Add/remove technology; 1 moves it behind native research; insert prerequisites |
| `rq_row_move`                                         | `rq_k` row; `rq_dir` -2/-1/1/2     | Move to first / previous / next / end, preserving prerequisites                |
| `rq_row_remove`                                       | `rq_k` row                         | Remove row and prune dependants lacking any prerequisite                       |
| `rq_clr_all`                                          | none                               | Clear non-native rows; honor rq_lock_slots game rule                           |
| `rq_ap_toggle`                                        | none                               | Toggle automatic planning                                                      |
| `rq_ap_pri_click`                                     | `rq_t`                             | Toggle priority target (maximum five)                                          |
| `rq_aps_change`                                       | `rq_apk` 1..7; `rq_apd` delta      | Cap / replan days / ahead days / land / navy / air / industry weights          |
| `rq_aps_reset`                                        | none                               | Reset planner defaults                                                         |
| `rq_aps_xp`, `rq_aps_jump`, `rq_aps_mio`, `rq_aps_jg` | none                               | Toggle corresponding automatic preference                                      |
| `rq_aps_clearpri`                                     | none                               | Clear all priority targets                                                     |
| `rq_save_do`                                          | none                               | Save manual queue to an in-game slot                                           |
| `rq_load_do`                                          | `rq_lsi` save row                  | Restore compatible saved queue                                                 |
| `rq_sv_delete`                                        | `rq_lsi` save row                  | Delete selected saved queue                                                    |

Visibility: country flag `rq_active` means initialized; `rq_q_open` opens queue; `rq_qmode` enables tree overlay; `rq_ap_on` enables planner. `rq_dlg`: 0 closed, 1 save, 2 load, 3 stats. `rq_ap_win`: 0/1 planner settings.

Arrays: `rq_queue` technology IDs, `rq_qprog` progress, `rq_qmio` organization IDs, `rq_qsrc` native-source markers; equal lengths. `rq_vanilla` native research IDs, `rq_active` mod-researched IDs; `rq_view` and `rq_vshow` are visible queue indices. Row status `rq_qst`: 1 native, 2 active, 3 queued/blocked. `rq_qdays`, `rq_qpct`, `rq_qname`, `rq_qfont` are parallel display data. `rq_tq_n`, `rq_slots`, `rq_lanes_n`, `rq_speed_shown` are counters. `rq_catalogue` is the technology picker list (IDs). `rq_svlen` is saved queue length, `rq_svok` compatibility flag.

The final verification report distinguishes implemented behavior from advanced upstream features that are not yet proved equivalent. Do not label every original feature supported solely because an action exists.
