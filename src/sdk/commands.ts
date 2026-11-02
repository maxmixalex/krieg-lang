// Generated from the bundled CWT projection. Do not edit by hand.
// CWT SHA-256: 4b3e365db80c5bb0cc7ce88d7ca58c37dc7bf66c31667e712605413218c8003c
import type { CountryRef, StateRef, CwtOpaque, CwtNode, ScopeByName, Effect, Trigger } from './index.js';
export interface GeneratedCountryEffects {
  /** Hires advisor (adds advisor idea) CWT: Config/effects_nsb.cwt:502. */
  "activate_advisor"(value: string): void;
  /** Activates specified decision for scope country. CWT: Config/effects.cwt:2649. */
  "activate_decision"(value: string): void;
  /** Activates mission, ignoring its normal trigger conditions. Cannot activate a mission that is already active. CWT: Config/effects.cwt:2589. */
  "activate_mission"(value: string): void;
  /** Shows mission will activate and name. Activation needs to be handled manually, effect is just an easier way to display name of mission. CWT: Config/effects.cwt:2387. */
  "activate_mission_tooltip"(value: string): void;
  /** Activates the shine effect on the focus with the given id. Focuses that are completed cannot have an activated shine effect. Note that tooltips for this effect are only shown in debug mode. CWT: Config/effects_gtd.cwt:147. */
  "activate_shine_on_focus"(value: string): void;
  /** Activates targeted decisions or mission, ignoring its normal trigger conditions, cooldown and fire only once. Cannot activate if active in interface. CWT: Config/effects.cwt:2604. */
  "activate_targeted_decision"(value: { "target": CountryRef; "decision": string } | CwtNode): void;
  /** Activates targeted decisions or mission, ignoring its normal trigger conditions, cooldown and fire only once. Cannot activate if active in interface. CWT: Config/effects.cwt:2612. */
  "activate_targeted_decision"(value: { "target": StateRef; "decision": string } | CwtNode): void;
  /** Adds an air ace. CWT: Config/effects.cwt:1863. */
  "add_ace"(value: { "name": string; "surname": string; "callsign": string; "type": string; "is_female"?: true } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:298. */
  "add_advisor_role"(value: { "character"?: string | CwtOpaque; "activate"?: boolean; "advisor": { "slot": string; "idea_token"?: string; "name"?: string; "desc"?: string; "traits": readonly (string)[]; "research_bonus"?: CwtNode; "ledger"?: string; "cost"?: number; "removal_cost"?: number; "ai_will_do"?: CwtNode; "modifier"?: CwtNode; "can_be_fired"?: boolean } | CwtNode } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3299. */
  "add_ai_strategy"(value: { "type": string; "id": string; "value": number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3355. */
  "add_ai_strategy"(value: { "type": "land_xp_spend_priority"; "id": string; "value": number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3363. */
  "add_ai_strategy"(value: { "type": "air_xp_spend_priority"; "id": string; "value": number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3371. */
  "add_ai_strategy"(value: { "type": "navy_xp_spend_priority"; "id": string; "value": number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3387. */
  "add_ai_strategy"(value: { "type": string; "id": CountryRef; "value": number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3396. */
  "add_ai_strategy"(value: { "type": string; "target": string | CountryRef; "value": number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3405. */
  "add_ai_strategy"(value: { "type": string; "id": CountryRef } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3413. */
  "add_ai_strategy"(value: { "type": "dont_join_wars_with"; "id"?: CountryRef; "target_country"?: CountryRef; "value": number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3436. */
  "add_ai_strategy"(value: { "type": "naval_dominance"; "id": string; "value": number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3445. */
  "add_ai_strategy"(value: { "type": string; "id": string } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3452. */
  "add_ai_strategy"(value: { "type": string; "value": number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3459. */
  "add_ai_strategy"(value: { "type": string; "target": StateRef; "value": number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3467. */
  "add_ai_strategy"(value: { "type": string; "id": StateRef; "value": number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3475. */
  "add_ai_strategy"(value: { "type": string; "id": string; "target": number; "value": number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3484. */
  "add_ai_strategy"(value: { "type": string; "id": CountryRef; "target": string; "value": number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3510. */
  "add_ai_strategy"(value: { "type": "research_tech"; "id": string | number; "value": number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3519. */
  "add_ai_strategy"(value: { "type": "scorched_earth_prio"; "id": CountryRef; "value"?: number; "states"?: readonly (StateRef)[] } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3534. */
  "add_ai_strategy"(value: { "type": "put_unit_buffers"; "ratio": number; "order_id"?: number; "states"?: readonly (StateRef)[]; "area"?: string; "subtract_invasions_from_need"?: boolean; "subtract_fronts_from_need"?: boolean } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3553. */
  "add_ai_strategy"(value: { "type": "front_control"; "tag"?: CountryRef; "id"?: CountryRef; "state"?: StateRef; "area"?: string; "strategic_region"?: string; "country_trigger"?: CwtNode; "state_trigger"?: CwtNode; "ratio"?: number; "priority"?: number; "ordertype"?: string; "execution_type"?: string; "execute_order"?: boolean; "manual_attack"?: boolean; "value"?: number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3596. */
  "add_ai_strategy"(value: { "type": string; "tag"?: CountryRef; "id"?: CountryRef; "state"?: StateRef; "strategic_region"?: string; "area"?: string; "country_trigger"?: CwtNode; "state_trigger"?: CwtNode; "value": number; "ratio"?: number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3627. */
  "add_ai_strategy"(value: { "type": "intelligence_agency_branch_desire_factor"; "id": string; "value": number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3635. */
  "add_ai_strategy"(value: { "type": "spent_faction_initiative_priority"; "id": string; "value": number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3643. */
  "add_ai_strategy"(value: { "type": "asking_foreign_garrison"; "value": number; "id"?: CountryRef } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3652. */
  "add_ai_strategy"(value: { "type": "operative_mission"; "mission": string; "value": number; "mission_target"?: CountryRef; "state"?: StateRef; "priority"?: number; "num_operatives"?: number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3668. */
  "add_ai_strategy"(value: { "type": "operative_operation"; "operation": string | number; "value": number; "operation_target": CountryRef | number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3681. */
  "add_ai_strategy"(value: { "type": string; "equipment_type"?: string; "seller"?: CountryRef; "value": number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3694. */
  "add_ai_strategy"(value: { "type": "force_concentration_front_factor"; "tag"?: CountryRef; "state"?: StateRef; "strategic_region"?: string; "area"?: string; "country_trigger"?: CwtNode; "state_trigger"?: CwtNode; "ratio"?: number; "value": number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3731. */
  "add_ai_strategy"(value: { "type": "force_concentration_target_weight"; "tag"?: CountryRef; "state"?: StateRef; "strategic_region"?: string; "area"?: string; "country_trigger"?: CwtNode; "state_trigger"?: CwtNode; "value": number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3765. */
  "add_ai_strategy"(value: { "type": "convoy_raiding_target"; "id": CountryRef; "value": number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3773. */
  "add_ai_strategy"(value: { "type": "naval_blockade"; "target_country": CountryRef; "id": string; "value": number } | CwtNode): void;
  /** Adds % freedom score to the autonomy. CWT: Config/effects.cwt:2039. */
  "add_autonomy_ratio"(value: { "value": number; "localization"?: string } | CwtNode): void;
  /** Adds exact freedom score to the autonomy. CWT: Config/effects.cwt:2024. */
  "add_autonomy_score"(value: { "value": number; "localization"?: string } | CwtNode): void;
  /** Add breakthrough points to one specialization or all for a country scope. CWT: Config/effects_gtd.cwt:3. */
  "add_breakthrough_points"(value: { "specialization": string | "all"; "value": number } | CwtNode): void;
  /** Add breakthrough progress to one specialization or all for a country scope.The value can either be an absolute value or a script constant. CWT: Config/effects_gtd.cwt:90. */
  "add_breakthrough_progress"(value: { "value": number | string | number | boolean | CountryRef | StateRef; "specialization": string | "all" } | CwtNode): void;
  /** Add CIC funds to the tag CWT: Config/effects_aat.cwt:156. */
  "add_cic"(value: number): void;
  /** Adds a civil war target to a specific country. CWT: Config/effects_new.cwt:824. */
  "add_civil_war_target"(value: CountryRef): void;
  /** Adds the collaboration in a target country with our currently scoped country. CWT: Config/effects_new.cwt:832. */
  "add_collaboration"(value: { "target": CountryRef; "value": number } | CwtNode): void;
  /** Add command power to country. CWT: Config/effects.cwt:2319. */
  "add_command_power"(value: number): void;
  /** Adds a contested owner to a state. The effect can be used either from a country or a state scope and accepts the other as parameter. CWT: Config/effects_gtd.cwt:143. */
  "add_contested_owner"(value: StateRef): void;
  /**  CWT: Config/effects_nsb.cwt:65. */
  "add_corps_commander_role"(value: { "character"?: string | CwtOpaque; "desc"?: string; "traits"?: readonly (string)[]; "skill"?: number; "attack_skill"?: number; "defense_skill"?: number; "planning_skill"?: number; "logistics_skill"?: number; "female"?: boolean; "legacy_id"?: string; "visible"?: CwtNode } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:234. */
  "add_country_leader_role"(value: { "character"?: string | CwtOpaque; "promote_leader"?: boolean; "country_leader": { "desc"?: string; "ideology": string; "traits"?: readonly (string)[]; "expire"?: string; "id"?: number } | CwtNode } | CwtNode): void;
  /** Add trait to active country leader. CWT: Config/effects.cwt:603. */
  "add_country_leader_trait"(value: string): void;
  /** Add trait to active country leader. CWT: Config/effects.cwt:607. */
  "add_country_leader_trait"(value: { "trait": string; "ideology"?: string } | CwtNode): void;
  /** You can mix and match track/subdoctrine/doctrine/folder triggers Example: add_daily_mastery = { amount = 1 days = 60 track = infantry } Add daily progress made within a **Track**, **Subdoctrine**, **Grand Doctrine** or **Doctrine Folder**. CWT: Config/effects_ncns.cwt:64. */
  "add_daily_mastery"(value: { "name": string; "amount": number; "days": number; "track"?: string; "sub_doctrine"?: string; "grand_doctrine"?: string; "folder"?: string } | CwtNode): void;
  /** Add days to 'mission_timeout' value of a mission. CWT: Config/effects_new.cwt:198. */
  "add_days_mission_timeout"(value: { "mission": string; "days": number } | CwtNode): void;
  /** Adds/removes days to 'days_remove' value of a decision. CWT: Config/effects_new.cwt:191. */
  "add_days_remove"(value: { "decision": string; "days": number } | CwtNode): void;
  /** Add decryption against a target country. CWT: Config/effects_new.cwt:467. */
  "add_decryption"(value: { "target": CountryRef; "amount": number } | CwtNode): void;
  /** Add decryption against a target country. CWT: Config/effects_new.cwt:476. */
  "add_decryption"(value: { "target": CountryRef; "ratio": number } | CwtNode): void;
  /** Add free bonus design discount to given types with a set of uses.The value for uses and cost_factor can either be an absolute value or a script constant. CWT: Config/effects_gtd.cwt:103. */
  "add_design_template_bonus"(value: { "name"?: string; "uses": number | string | number | boolean | CountryRef | StateRef; "cost_factor": number | string | number | boolean | CountryRef | StateRef; "equipment": string } | CwtNode): void;
  /** Add divisional commander xp to unit CWT: Config/effects_new.cwt:1018. */
  "add_divisional_commander_xp"(value: number): void;
  /** Adds a limited use doctrine bonus CWT: Config/effects.cwt:1401. */
  "add_doctrine_cost_reduction"(value: { "category"?: string; "technology"?: string; "uses"?: number; "cost_reduction": number; "name": string } | CwtNode): void;
  /** Adds a dynamic modifier to country/state/unit leader. CWT: Config/effects.cwt:3137. */
  "add_dynamic_modifier"(value: { "modifier": string; "scope"?: CountryRef | StateRef | string | CwtOpaque; "days"?: number } | CwtNode): void;
  /** Adds the specified equipment bonuses to the country. As description the given loc key or the name of given special project will be used. Same usage as in Ideas/National spirits CWT: Config/effects_gtd.cwt:120. */
  "add_equipment_bonus"(value: { "name"?: string; "project"?: CwtOpaque; "bonus": CwtNode } | CwtNode): void;
  /** Adds an equipment production. CWT: Config/effects.cwt:1833. */
  "add_equipment_production"(value: { "equipment": { "type": string; "creator"?: CountryRef; "version_name"?: string; "version"?: number } | CwtNode; "name"?: string | number | boolean | CountryRef | StateRef; "amount"?: number; "requested_factories"?: number; "progress"?: number; "efficiency"?: number; "industrial_manufacturer"?: string } | CwtNode): void;
  /** Add equipment subsidy to a tag CWT: Config/effects_aat.cwt:160. */
  "add_equipment_subsidy"(value: { "cic": number; "equipment_type": string; "seller_trigger"?: CwtNode | string; "seller_tags"?: readonly (CountryRef)[] } | CwtNode): void;
  /** Adds equipment to the countries stockpiles. CWT: Config/effects.cwt:1897. */
  "add_equipment_to_stockpile"(value: { "type": string; "amount": number; "producer"?: CountryRef; "version_name"?: string; "variant_name"?: string } | CwtNode): void;
  /** Does not support manifests Adds a goal to the current's country faction. CWT: Config/effects_ncns.cwt:229. */
  "add_faction_goal"(value: string): void;
  /** Adds extra goal slots to the faction for a specific category CWT: Config/effects_ncns.cwt:190. */
  "add_faction_goal_slot"(value: { "category": string; "value": number } | CwtNode): void;
  /** Adds influence to the country based on the given ratio of the faction's total influence CWT: Config/effects_ncns.cwt:197. */
  "add_faction_influence_ratio"(value: number): void;
  /** Adds influence to the country in the faction CWT: Config/effects_ncns.cwt:186. */
  "add_faction_influence_score"(value: number): void;
  /** Adds Faction Initiative points to the current country's faction. CWT: Config/effects_ncns.cwt:239. */
  "add_faction_initiative"(value: number): void;
  /** Example: add_faction_power_projection = 100 Add x faction power projection CWT: Config/effects_ncns.cwt:148. */
  "add_faction_power_projection"(value: number): void;
  /**  CWT: Config/effects_nsb.cwt:153. */
  "add_field_marshal_role"(value: { "character"?: string | CwtOpaque; "desc"?: string; "traits"?: readonly (string)[]; "skill": number; "attack_skill": number; "defense_skill": number; "planning_skill": number; "logistics_skill": number; "legacy_id"?: string; "visible"?: CwtNode } | CwtNode): void;
  /** Add fuel to the country. CWT: Config/effects.cwt:3059. */
  "add_fuel"(value: number): void;
  /** Add idea(s) to country. CWT: Config/effects.cwt:669. */
  "add_ideas"(value: string): void;
  /** Add idea(s) to country. CWT: Config/effects.cwt:672. */
  "add_ideas"(value: readonly (string)[]): void;
  /** Add the specified amount of intel over a specified country. CWT: Config/effects_new.cwt:690. */
  "add_intel"(value: { "target": CountryRef; "civilian_intel"?: number; "army_intel"?: number; "navy_intel"?: number; "airforce_intel"?: number } | CwtNode): void;
  /** Adds legitimacy to scope country. Value has to be 0-100. CWT: Config/effects.cwt:3789. */
  "add_legitimacy"(value: number): void;
  /** Adds manpower to the country in scope or locally on a state if in state scope. CWT: Config/effects.cwt:10. */
  "add_manpower"(value: number): void;
  /** You can mix and match track/subdoctrine/doctrine/folder triggers Example: add_mastery = { amount = 50 track = infantry } Add the progress made within a **Track**, **Subdoctrine**, **Grand Doctrine** or **Doctrine Folder**. CWT: Config/effects_ncns.cwt:41. */
  "add_mastery"(value: { "amount": number; "track"?: string; "sub_doctrine"?: string; "grand_doctrine"?: string; "folder"?: string } | CwtNode): void;
  /** You can mix and match track/subdoctrine/doctrine/folder triggers Example: add_mastery_bonus = { bonus = 0.1 days = 60 track = infantry } Add % modifier for mastery income of a **Track**, **Subdoctrine**, **Grand Doctrine** or **Doctrine Folder**. CWT: Config/effects_ncns.cwt:91. */
  "add_mastery_bonus"(value: { "name": string; "bonus": number; "days": number; "track"?: string; "sub_doctrine"?: string; "grand_doctrine"?: string; "folder"?: string } | CwtNode): void;
  /** Add mines to a strategic region for scoped country. CWT: Config/effects.cwt:3275. */
  "add_mines"(value: { "region": string; "amount": number } | CwtNode): void;
  /** Add to the base cooldown (in days) after attaching a policy in the MIO policy, found in country in scope with input policy token. This changes the base value. Modifiers will still apply over it. Value can be negative to reduce cost, but final cooldown cannot be negative (capped at 0, no error raised CWT: Config/effects_aat.cwt:142. */
  "add_mio_policy_cooldown"(value: { "policy": string; "value": number } | CwtNode): void;
  /** Add to the base cost (in PP) for attaching a policy in the MIO policy, found in country in scope with input policy token. This changes the base value. Modifiers will still apply over it. Value can be negative to reduce cost, but final cost cannot be negative (capped at 0, no error raised) CWT: Config/effects_aat.cwt:128. */
  "add_mio_policy_cost"(value: { "policy": string; "value": number } | CwtNode): void;
  /** Adds country threat. CWT: Config/effects.cwt:1594. */
  "add_named_threat"(value: { "threat": number; "name": string } | CwtNode): void;
  /** Adds new namespace. CWT: Config/effects.cwt:761. */
  "add_namespace"(value: string | number | boolean | CountryRef | StateRef): void;
  /**  CWT: Config/effects_nsb.cwt:194. */
  "add_naval_commander_role"(value: { "character"?: string | CwtOpaque; "desc"?: string; "traits"?: readonly (string)[]; "skill": number; "attack_skill": number; "defense_skill": number; "maneuvering_skill": number; "coordination_skill": number; "legacy_id"?: string; "visible"?: CwtNode } | CwtNode): void;
  /** Add nukes to country. CWT: Config/effects.cwt:831. */
  "add_nuclear_bombs"(value: number): void;
  /** Add an offsite building to a country. CWT: Config/effects.cwt:2423. */
  "add_offsite_building"(value: { "type": string; "level": number } | CwtNode): void;
  /** Adds a specific token against against another country. CWT: Config/effects_new.cwt:237. */
  "add_operation_token"(value: { "tag": CountryRef; "token": string } | CwtNode): void;
  /** Add opinion modifier(s) to target(s). CWT: Config/effects.cwt:451. */
  "add_opinion_modifier"(value: { "target": CountryRef; "modifier": string; "days"?: number } | CwtNode): void;
  /** Add political power to country. CWT: Config/effects.cwt:697. */
  "add_political_power"(value: number): void;
  /** Add popularity to an ideology in a country. CWT: Config/effects.cwt:1166. */
  "add_popularity"(value: { "ideology": string | number | CountryRef; "popularity": number } | CwtNode): void;
  /** Add modifier to Balance of Power CWT: Config/effects_bba.cwt:63. */
  "add_power_balance_modifier"(value: { "id": string; "modifier": string } | CwtNode): void;
  /** Add a new side to BOP CWT: Config/effects_bba.cwt:27. */
  "add_power_balance_side"(value: { "id": string; "side": string } | CwtNode): void;
  /** Add value to balance of power. Float from -1 to 1, adding 0.25 will change BoP to the right by 25% CWT: Config/effects_bba.cwt:41. */
  "add_power_balance_value"(value: { "id": string; "value": number; "tooltip_side"?: string } | CwtNode): void;
  /** Add efficiency factor to strategic region for from country. CWT: Config/effects.cwt:2342. */
  "add_region_efficiency"(value: "replace_me"): void;
  /** Adds a static modifier between current scope and target. CWT: Config/effects.cwt:2156. */
  "add_relation_modifier"(value: { "target": CountryRef; "modifier": string } | CwtNode): void;
  /** Adds an override rule to the country's relation to other countries. If there are multiple applicable overrides for a rule, then they are combined using AND logic for positive rules (e.g. can_access_market) and OR logic for negative rules (e.g. can_not_declare_war).\n The description of the effect is CWT: Config/effects_toa.cwt:7. */
  "add_relation_rule_override"(value: CwtNode): void;
  /** Adds a research slot (negative values subtracts). CWT: Config/effects.cwt:1421. */
  "add_research_slot"(value: number): void;
  /** Adds resource production to state. CWT: Config/effects.cwt:1519. */
  "add_resource"(value: { "type": string; "amount": number; "state": StateRef } | CwtNode): void;
  /** Add political power to country scaled by the difference in IC between the receiver and another country. CWT: Config/effects.cwt:1155. */
  "add_scaled_political_power"(value: number): void;
  /** Add scientist role to a character. The character can come from the scope or from an input parameter. The scientist role format is the same as in the character DB. Except the visible trigger - a scientist role created via effect cannot have triggers. CWT: Config/effects_gtd.cwt:209. */
  "add_scientist_role"(value: { "character": string | CwtOpaque; "scientist": { "desc"?: string; "skills"?: CwtNode; "traits"?: readonly (string)[] } | CwtNode } | CwtNode): void;
  /** Adds the stability to the country in scope. Example: add_stability = 5. CWT: Config/effects.cwt:6. */
  "add_stability"(value: number): void;
  /** Add claim on state. CWT: Config/effects.cwt:437. */
  "add_state_claim"(value: StateRef): void;
  /** Add core on state. CWT: Config/effects.cwt:46. */
  "add_state_core"(value: StateRef): void;
  /** Adds either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:154. */
  "add_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /** Adds a limited use tech bonus. CWT: Config/effects.cwt:1385. */
  "add_tech_bonus"(value: CwtNode): void;
  /** Adds country threat. CWT: Config/effects.cwt:1437. */
  "add_threat"(value: number): void;
  /** Add time limited idea to country idea, supports days/months/years. CWT: Config/effects.cwt:1542. */
  "add_timed_idea"(value: { "idea": string; "days"?: number; "months"?: number; "years"?: number } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2824. */
  "add_to_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2846. */
  "add_to_array"(value: CwtNode): void;
  /** Adds specified country to faction. CWT: Config/effects.cwt:1020. */
  "add_to_faction"(value: CountryRef): void;
  /** Adds country to technology sharing group of specified name. CWT: Config/effects.cwt:2016. */
  "add_to_tech_sharing_group"(value: string): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2943. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2965. */
  "add_to_temp_array"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:122. */
  "add_to_temp_variable"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:129. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:67. */
  "add_to_variable"(value: CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:71. */
  "add_to_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Adds country to the specified war. CWT: Config/effects.cwt:1747. */
  "add_to_war"(value: { "targeted_alliance": CountryRef; "enemy": CountryRef; "hostility_reason"?: string; "single_target_only"?: boolean } | CwtNode): void;
  /** makes character head of their ideology party CWT: Config/effects_nsb.cwt:510. */
  "add_trait"(value: { "character"?: string | CwtOpaque; "trait": string; "ideology"?: string; "slot"?: string } | CwtNode): void;
  /** Adds permanent subunit and subunit category bonuses for country. CWT: Config/effects_gtd.cwt:370. */
  "add_unit_bonus"(value: CwtNode): void;
  /** Adds units to a division template. CWT: Config/effects.cwt:578. */
  "add_units_to_division_template"(value: { "template_name": string; "regiments"?: CwtNode; "support"?: CwtNode; "regimental_support"?: CwtNode } | CwtNode): void;
  /** Adds victory point to province. CWT: Config/effects_new.cwt:957. */
  "add_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /** Adds the war support to the country in scope. Example: add_war_support = 5. CWT: Config/effects.cwt:2222. */
  "add_war_support"(value: number): void;
  /** Ai message... ?. CWT: Config/effects.cwt:1881. */
  "ai_message"(value: "replace_me"): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3320. */
  "ai_strategy"(value: { "type": "equipment_production_min_factories"; "id": string; "value": number } | CwtNode): void;
  /** Adds strategy entry to country AI. CWT: Config/effects.cwt:3329. */
  "ai_strategy"(value: { "type": "equipment_production_min_factories_archetype"; "id": string; "value": number } | CwtNode): void;
  /** Add air experience for country. CWT: Config/effects.cwt:1348. */
  "air_experience"(value: number): void;
  /** Add air experience for country. CWT: Config/effects.cwt:1352. */
  "air_experience"(value: string): void;
  /**  CWT: Config/scopes.cwt:51. */
  "AND"(value: CwtNode): void;
  /** Annex the target country. CWT: Config/effects.cwt:835. */
  "annex_country"(value: { "target": CountryRef; "transfer_troops"?: boolean } | CwtNode): void;
  /** Add army experience for country. CWT: Config/effects.cwt:1332. */
  "army_experience"(value: number): void;
  /** Add army experience for country. CWT: Config/effects.cwt:1336. */
  "army_experience"(value: string): void;
  /** Become exile in target nation. become_exiled_in = { target = TAG legitimacy = 0-100 (optional) }. CWT: Config/effects.cwt:2750. */
  "become_exiled_in"(value: { "target": CountryRef; "legitimacy"?: number } | CwtNode): void;
  /** Boost planning of units that are belongs to the army group/navy of this unit leader. CWT: Config/effects.cwt:2338. */
  "boost_planning"(value: number): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1372. */
  "break"(value: "none"): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1376. */
  "break"(value: true): void;
  /** Removes embargo from target country. CWT: Config/effects.cwt:1586. */
  "break_embargo"(value: CountryRef): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:844. */
  "build_railway"(value: { "path": readonly (number)[]; "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:878. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_province": number; "target_province": number; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:915. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_state": StateRef; "target_state": StateRef; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Cancel border war between two states. CWT: Config/effects.cwt:2525. */
  "cancel_border_war"(value: { "dont_fire_events"?: boolean; "attacker": StateRef; "defender": StateRef } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:63. */
  "capital_scope"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Capture an operative. Can be used from a scope and a target that is either a country or a unit leader. CWT: Config/effects_new.cwt:111. */
  "capture_operative"(value: CwtOpaque): void;
  /** Capture an operative. Can be used from a scope and a target that is either a country or a unit leader. CWT: Config/effects_new.cwt:115. */
  "capture_operative"(value: { "operative": CwtOpaque; "ignore_death_chance"?: boolean } | CwtNode): void;
  /** Changes player to other country. CWT: Config/effects.cwt:60. */
  "change_tag_from"(value: CountryRef): void;
  /** Display in tooltip every character that fulfils the "limit" trigger. CWT: Config/effects_nsb.cwt:604. */
  "character_list_tooltip"(value: Effect<ScopeByName["character"]> | { limit?: Trigger<ScopeByName["character"]>; effects: Effect<ScopeByName["character"]> } | { "limit"?: CwtNode } | CwtNode): void;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_effects_temp.cwt:242. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): void;
  /** Clamps a variable between two a values or another variables. CWT: Config/variable_effects.cwt:188. */
  "clamp_variable"(value: { "var": CwtOpaque; "min"?: number | string; "max"?: number | string } | CwtNode): void;
  /** Clears the contents of array. CWT: Config/effects.cwt:2907. */
  "clear_array"(value: string | CwtOpaque): void;
  /** Remove cap for a division template. CWT: Config/effects.cwt:2550. */
  "clear_division_template_cap"(value: { "division_template": string } | CwtNode): void;
  /** Clear a global event target. CWT: Config/effects.cwt:1364. */
  "clear_global_event_target"(value: string): void;
  /** Clear all global event targets. CWT: Config/effects.cwt:1368. */
  "clear_global_event_targets"(value: true): void;
  /** Clears rule added by set_rule. In the example it will clear can_not_declare_war = yes set by set_rule: clear_rule = { can_not_declare_war = yes } CWT: Config/effects.cwt:1471. */
  "clear_rule"(value: CwtNode): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3016. */
  "clear_temp_array"(value: string): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3019. */
  "clear_temp_array"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:206. */
  "clear_variable"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:210. */
  "clear_variable"(value: CwtOpaque): void;
  /** Clear country flag. CWT: Config/effects.cwt:153. */
  "clr_country_flag"(value: string): void;
  /** Clear global flag. CWT: Config/effects.cwt:170. */
  "clr_global_flag"(value: string): void;
  /** Unlocks a focus for a country. CWT: Config/effects.cwt:1705. */
  "complete_national_focus"(value: string): void;
  /** Unlocks a focus for a country. CWT: Config/effects.cwt:1711. */
  "complete_national_focus"(value: { "focus": string; "use_side_message"?: boolean; "originator_name"?: string } | CwtNode): void;
  /** Complete a special project for the country in scope. This effect will not take into account the current state of the project tree and will allow you to unlock a project even if the one before is not unlocked. Since the project is not completed within a facility, the facility state and scientist effe CWT: Config/effects_gtd.cwt:160. */
  "complete_special_project"(value: CwtOpaque): void;
  /** Complete a special project for the country in scope. This effect will not take into account the current state of the project tree and will allow you to unlock a project even if the one before is not unlocked. Since the project is not completed within a facility, the facility state and scientist effe CWT: Config/effects_gtd.cwt:163. */
  "complete_special_project"(value: string): void;
  /** Complete a special project for the country in scope. This effect will not take into account the current state of the project tree and will allow you to unlock a project even if the one before is not unlocked. Since the project is not completed within a facility, the facility state and scientist effe CWT: Config/effects_gtd.cwt:166. */
  "complete_special_project"(value: { "project": CwtOpaque | string; "scientist"?: string; "state"?: StateRef; "iteration_output"?: readonly (string)[]; "show_modifiers"?: boolean } | CwtNode): void;
  /** Fires a country event. CWT: Config/effects.cwt:240. */
  "country_event"(value: { "id": string; "hours"?: number; "days"?: number; "months"?: number; "random_hours"?: number; "random_days"?: number; "random"?: number | CwtNode; "tooltip"?: string } | CwtNode): void;
  /** Fires a country event. CWT: Config/effects.cwt:286. */
  "country_event"(value: string): void;
  /** Lock all the division template at the country level. Note that you need to unlock them in the same way Can also supply the reason it is locked with localization key(You can't use 'set_division_template_lock' individually, because the lock at the country level will not be removed) Ex:country_lock_all CWT: Config/effects_new.cwt:666. */
  "country_lock_all_division_template"(value: boolean): void;
  /** Lock all the division template at the country level. Note that you need to unlock them in the same way Can also supply the reason it is locked with localization key(You can't use 'set_division_template_lock' individually, because the lock at the country level will not be removed) Ex:country_lock_all CWT: Config/effects_new.cwt:672. */
  "country_lock_all_division_template"(value: { "is_locked": boolean; "desc": string } | CwtNode): void;
  /** Create a colonial division template for overlord/owner. Available parameters are subject and division_template, where the subject parameter is the country tag for an overlords subject. And the division_template is the regular effect to create a division template. CWT: Config/effects_gtd.cwt:26. */
  "create_colonial_division_template"(value: { "subject": CountryRef; "division_template": { "name": string; "localization_key"?: string; "division_names_group"?: string; "role"?: string; "front_role_override"?: string; "override_model"?: string; "template_counter"?: number; "is_army_hq"?: boolean; "is_locked"?: boolean; "force_allow_recruiting"?: boolean; "obsolete"?: boolean; "division_cap"?: number; "regiments": CwtNode; "support"?: CwtNode; "regimental_support"?: CwtNode; "priority"?: number; "is_fake_intel_division"?: boolean; "foreign_template_tag"?: CountryRef; "origin_type"?: "subject" } | CwtNode } | CwtNode): void;
  /** Creates a corps commander for country in scope. CWT: Config/effects.cwt:1652. */
  "create_corps_commander"(value: { "name"?: string | number | boolean | CountryRef | StateRef; "desc"?: string; "picture"?: string | number | boolean | CountryRef | StateRef; "portrait_path"?: string | number | boolean | CountryRef | StateRef; "gfx"?: string; "traits": readonly (string)[]; "skill": number; "attack_skill": number; "defense_skill": number; "planning_skill": number; "logistics_skill": number; "id"?: string; "legacy_id"?: string; "female"?: boolean } | CwtNode): void;
  /** Creates a leader and adds it to proper party in country. CWT: Config/effects.cwt:471. */
  "create_country_leader"(value: { "name": string | number | boolean | CountryRef | StateRef; "desc"?: string; "picture": string | number | boolean | CountryRef | StateRef; "ideology": string; "expire"?: string; "traits"?: readonly (string)[]; "id"?: string; "female"?: boolean } | CwtNode): void;
  /** Creates a dynamic country and runs child effects on it. CWT: Config/effects_new.cwt:327. */
  "create_dynamic_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Creates an enitity Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. For comparison, default minimum zoom level (closest to the map) is 50 units, while default maximum CWT: Config/effects_nsb.cwt:823. */
  "create_entity"(value: { "entity": string; "id"?: string; "var"?: string; "x"?: number; "y"?: number; "z"?: number; "province"?: number; "state"?: StateRef; "rotation": number; "scale": number; "min_zoom": number; "visible"?: string } | CwtNode): void;
  /** Creates a new equipment variant. CWT: Config/effects.cwt:1781. */
  "create_equipment_variant"(value: { "name"?: string; "type": string; "name_group"?: string; "parent_version"?: number; "role_icon_index"?: number; "history"?: boolean; "allow_without_tech"?: boolean; "show_position"?: boolean; "upgrades"?: CwtNode; "modules"?: CwtNode; "obsolete"?: true; "mark_older_equipment_obsolete"?: boolean; "icon"?: string; "model"?: string; "design_team"?: string } | CwtNode): void;
  /** Create a faction of specified name. CWT: Config/effects.cwt:827. */
  "create_faction"(value: string): void;
  /** Create a faction from a template allows for optional customization of name, icon and color. CWT: Config/effects_ncns.cwt:201. */
  "create_faction_from_template"(value: string): void;
  /** Create a faction from a template allows for optional customization of name, icon and color. CWT: Config/effects_ncns.cwt:204. */
  "create_faction_from_template"(value: { "template": string; "name"?: string; "icon"?: string; "color"?: readonly (number)[] } | CwtNode): void;
  /** Creates a field marshal for country in scope. CWT: Config/effects.cwt:1614. */
  "create_field_marshal"(value: { "name": string | number | boolean | CountryRef | StateRef; "desc"?: string; "picture": string | number | boolean | CountryRef | StateRef; "portrait_path"?: string | number | boolean | CountryRef | StateRef; "gfx"?: string; "traits": readonly (string)[]; "skill": number; "attack_skill": number; "defense_skill": number; "planning_skill": number; "logistics_skill": number; "id"?: string; "legacy_id"?: string; "female"?: boolean } | CwtNode): void;
  /** Creates trade between two countries. CWT: Config/effects.cwt:1566. */
  "create_import"(value: { "amount"?: number; "resource": string; "factories"?: number; "exporter": CountryRef } | CwtNode): void;
  /** Create an Intelligence Agency for the country, if it is not already done. CWT: Config/effects_new.cwt:632. */
  "create_intelligence_agency"(value: true): void;
  /** Create an Intelligence Agency for the country, if it is not already done. CWT: Config/effects_new.cwt:636. */
  "create_intelligence_agency"(value: { "name": string; "icon": string } | CwtNode): void;
  /** Creates an admiral for country in scope. CWT: Config/effects.cwt:716. */
  "create_navy_leader"(value: { "name": string | number | boolean | CountryRef | StateRef; "desc"?: string; "picture"?: string | number | boolean | CountryRef | StateRef; "portrait_path"?: string | number | boolean | CountryRef | StateRef; "gfx"?: string; "traits": readonly (string)[]; "skill": number; "attack_skill": number; "defense_skill": number; "maneuvering_skill": number; "coordination_skill": number; "id"?: string; "legacy_id"?: string; "female"?: boolean } | CwtNode): void;
  /** Create operative for country. CWT: Config/effects_new.cwt:66. */
  "create_operative_leader"(value: { "name"?: string | number | boolean | CountryRef | StateRef; "desc"?: string; "picture"?: string | number | boolean | CountryRef | StateRef; "portrait_path"?: string | number | boolean | CountryRef | StateRef; "gfx"?: string; "traits"?: readonly (string)[]; "id"?: string; "available_to_spy_master"?: boolean; "bypass_recruitment"?: boolean; "nationalities"?: readonly (CountryRef)[]; "portrait_tag_override"?: CountryRef; "skill"?: number; "gender"?: "male" | "female" } | CwtNode): void;
  /** Creates production license. If the selection criteria fails to match a variant no license will be created. Example: create_production_license = { target = TAG cost_factor = 1 new_prioritised = no equipment = { type = small_plane_naval_bomber_airframe version = 1 version_name = \"Do 22\" }}" CWT: Config/effects.cwt:2128. */
  "create_production_license"(value: { "target": CountryRef; "equipment": { "type": string; "version"?: number; "version_name"?: string } | CwtNode; "cost_factor"?: number; "new_prioritised"?: boolean } | CwtNode): void;
  /** Creates a purchase contract between the countries CWT: Config/effects_aat.cwt:253. */
  "create_purchase_contract"(value: { "seller": CountryRef; "buyer": CountryRef; "civilian_factories": number; "equipment": { "type": string; "amount": number } | CwtNode } | CwtNode): void;
  /** Create railway gun effect CWT: Config/effects_nsb.cwt:713. */
  "create_railway_gun"(value: { "equipment": string; "name"?: string; "location"?: number } | CwtNode): void;
  /** Create a ship from another country and assign it to the reserve fleet. 'creator' is optional. If not set, it will be the scoped country. 'name' is optional. CWT: Config/effects_new.cwt:647. */
  "create_ship"(value: { "type": string; "equipment_variant": string | number | boolean | CountryRef | StateRef; "creator"?: CountryRef; "name"?: string | number | boolean | CountryRef | StateRef } | CwtNode): void;
  /** Creates wargoal for country in scope. CWT: Config/effects.cwt:1277. */
  "create_wargoal"(value: { "target": CountryRef; "type": string; "generator"?: readonly (StateRef)[] | "core_states" | "owned_states" | string | CwtOpaque | StateRef; "expire"?: string | number } | CwtNode): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:14. */
  "custom_effect_tooltip"(value: string): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:17. */
  "custom_effect_tooltip"(value: CwtNode): void;
  /** Executes the provided effects but with a custom tooltip surpressing all tooltips from all other effects inside this block. The custom tooltip is a [bindable localization] CWT: Config/effects_gtd.cwt:318. */
  "custom_override_tooltip"(value: CwtNode): void;
  /** damages units for given conditions. no tooltip generated CWT: Config/effects_nsb.cwt:666. */
  "damage_units"(value: { "province"?: number; "state"?: StateRef; "region"?: string; "limit"?: CwtNode; "damage"?: number; "org_damage"?: number; "str_damage"?: number; "ratio"?: boolean; "template"?: string; "division_template"?: string; "army"?: boolean; "navy"?: boolean } | CwtNode): void;
  /** Fires advisor (removes advisor idea) CWT: Config/effects_nsb.cwt:506. */
  "deactivate_advisor"(value: string): void;
  /** Deactivate the shine effect on the focus with the given id. The current focus cannot have it's shine effect removed. Note that tooltips for this effect are only shown in debug mode. CWT: Config/effects_gtd.cwt:153. */
  "deactivate_shine_on_focus"(value: string): void;
  /** Declares war on specified country. CWT: Config/effects.cwt:1134. */
  "declare_war_on"(value: { "target": CountryRef; "type": string; "generator"?: readonly (StateRef)[] | string | CwtOpaque | StateRef } | CwtNode): void;
  /** Delete units of a country. No tooltip is generated. CWT: Config/effects_new.cwt:11. */
  "delete_unit"(value: { "template"?: string | number | boolean | CountryRef | StateRef; "division_template"?: string; "id"?: number; "state"?: StateRef; "disband"?: boolean } | CwtNode): void;
  /** Delete a template and its units. CWT: Config/effects.cwt:2564. */
  "delete_unit_template_and_units"(value: { "division_template": string; "disband"?: boolean } | CwtNode): void;
  /** Deletes units that uses a specific template. CWT: Config/effects_new.cwt:486. */
  "delete_units"(value: { "division_template": string; "disband"?: boolean } | CwtNode): void;
  /** Destroys an existing entity IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:849. */
  "destroy_entity"(value: string): void;
  /** Destroys ships of specified country and amount. CWT: Config/effects.cwt:2276. */
  "destroy_ships"(value: { "type": string; "count": number | "all" } | CwtNode): void;
  /** Set up a diplomatic relation between two nations. CWT: Config/effects.cwt:1500. */
  "diplomatic_relation"(value: { "country": CountryRef; "relation": string; "active"?: boolean } | CwtNode): void;
  /** Dismantle faction led by the current country. CWT: Config/effects.cwt:1016. */
  "dismantle_faction"(value: boolean): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:155. */
  "divide_temp_variable"(value: CwtNode): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:179. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:91. */
  "divide_variable"(value: CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:116. */
  "divide_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Adds a division template to country. CWT: Config/effects.cwt:574. */
  "division_template"(value: { "name": string; "localization_key"?: string; "division_names_group"?: string; "role"?: string; "front_role_override"?: string; "override_model"?: string; "template_counter"?: number; "is_army_hq"?: boolean; "is_locked"?: boolean; "force_allow_recruiting"?: boolean; "obsolete"?: boolean; "division_cap"?: number; "regiments": CwtNode; "support"?: CwtNode; "regimental_support"?: CwtNode; "priority"?: number; "is_fake_intel_division"?: boolean; "foreign_template_tag"?: CountryRef; "origin_type"?: "subject" } | CwtNode): void;
  /** Drops country cosmetic tag. CWT: Config/effects.cwt:2051. */
  "drop_cosmetic_tag"(value: true): void;
  /** Shows just tooltip of effects. CWT: Config/effects.cwt:1510. */
  "effect_tooltip"(value: CwtNode): void;
  /** Use after (else_)if for a catch-all case. CWT: Config/effects.cwt:431. */
  "else"(value: CwtNode): void;
  /** Use after (else_)if to check other triggers only if first if fails. CWT: Config/effects.cwt:422. */
  "else_if"(value: CwtNode): void;
  /** Ends the exile of of the current scope's country. CWT: Config/effects.cwt:3283. */
  "end_exile"(value: CountryRef): void;
  /** Stops specefied country being a puppet of current country. CWT: Config/effects.cwt:1555. */
  "end_puppet"(value: CountryRef): void;
  /** Shows event option tooltip CWT: Config/effects.cwt:27. */
  "event_option_tooltip"(value: string): void;
  /** Executes children effects on every active scientist (or "random_select_amount" of random character if specified) of the country in scope, that fulfills the "limit" trigger. CWT: Config/effects_gtd.cwt:77. */
  "every_active_scientist"(value: Effect<ScopeByName["character"]> | { limit?: Trigger<ScopeByName["character"]>; effects: Effect<ScopeByName["character"]> } | CwtNode): void;
  /** Executes children effects on every Allied Country different from the one in scope (or `random_select_amount` of random country if specified) that fulfills the `limit` trigger. CWT: Config/effects_gtd.cwt:274. */
  "every_allied_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on army leaders that fulfills the "limit" trigger. CWT: Config/effects.cwt:2249. */
  "every_army_leader"(value: CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:58. */
  "every_character"(value: Effect<ScopeByName["character"]> | { limit?: Trigger<ScopeByName["character"]>; effects: Effect<ScopeByName["character"]> } | CwtNode): void;
  /** - Example *every_collection_element = { limit = { xxx } add_political_power = 1 } - Some collections, like 'country:faction_members', require country scope - Supports 'limit' trigger Applies arbitrary effects to all elements of a collection. Supports both anonymous and regular collections CWT: Config/effects_ncns.cwt:248. */
  "every_collection_element"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on every controlled state that fulfils the "limit" trigger. tooltip=key can be added to override tooltip title. CWT: Config/effects_new.cwt:297. */
  "every_controlled_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:3. */
  "every_core_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfills the "limit" trigger. CWT: Config/effects.cwt:205. */
  "every_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /**  CWT: Config/effects_bba.cwt:112. */
  "every_country_division"(value: Effect<ScopeByName["unit"]> | { limit?: Trigger<ScopeByName["unit"]>; effects: Effect<ScopeByName["unit"]> } | CwtNode): void;
  /** Executes children effects on a all countries with original tag. tooltip=key can be defined to override tooltip title. CWT: Config/effects_new.cwt:445. */
  "every_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on random enemy country that fulfills the "limit" trigger. CWT: Config/effects.cwt:229. */
  "every_enemy_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every faction member of the country's faction in scope (if country does not have a faction it will only work on itself) CWT: Config/effects_ncns.cwt:182. */
  "every_faction_member"(value: CwtNode): void;
  /** Executes children effects on MIOs that fulfils the "limit" trigger. tooltip=key can be added to override tooltip title CWT: Config/effects_aat.cwt:4. */
  "every_military_industrial_organization"(value: Effect<ScopeByName["military_industrial_organization"]> | { limit?: Trigger<ScopeByName["military_industrial_organization"]>; effects: Effect<ScopeByName["military_industrial_organization"]> } | CwtNode): void;
  /** Executes children effects on navy leaders that fulfills the "limit" trigger. CWT: Config/effects.cwt:2261. */
  "every_navy_leader"(value: CwtNode): void;
  /** Executes children effects on every neighbor country that fulfills the "limit" trigger. CWT: Config/effects.cwt:217. */
  "every_neighbor_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every occupied country that fulfils the "limit" trigger. tooltip=key can be defined to override tooltip title. CWT: Config/effects_new.cwt:356. */
  "every_occupied_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on operatives that fulfils the "limit" trigger. tooltip=key can be added to override tooltip title CWT: Config/effects_new.cwt:139. */
  "every_operative"(value: Effect<ScopeByName["operative"]> | { limit?: Trigger<ScopeByName["operative"]>; effects: Effect<ScopeByName["operative"]> } | CwtNode): void;
  /** Executes children effects on every other country that fulfills the "limit" trigger. Excludes current country. CWT: Config/effects.cwt:1886. */
  "every_other_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every owned state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1073. */
  "every_owned_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfils the "limit" trigger. Difference with every_country is that it includes countries not yet present on the map. tooltip=key can be defined to override tooltip title. CWT: Config/effects_nsb.cwt:599. */
  "every_possible_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every purchase contract (or "random_select_amount" of random purchase contracts if specified) of the country in scope, that fulfills the "limit" trigger. tooltip = key need to be added to override the tooltip title CWT: Config/effects_aat.cwt:276. */
  "every_purchase_contract"(value: Effect<ScopeByName["purchase_contract"]> | { limit?: Trigger<ScopeByName["purchase_contract"]>; effects: Effect<ScopeByName["purchase_contract"]> } | CwtNode): void;
  /** Executes children effects on every scientist (or "random_select_amount" of random character if specified) of the country in scope, that fulfills the \\\"limit\\\" trigger. CWT: Config/effects_gtd.cwt:22. */
  "every_scientist"(value: Effect<ScopeByName["character"]> | { limit?: Trigger<ScopeByName["character"]>; effects: Effect<ScopeByName["character"]> } | CwtNode): void;
  /** Executes children effects on every state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1067. */
  "every_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Executes children effects on every subject country that fulfills the "limit" trigger. tooltip=key can be defined to override tooltip title CWT: Config/effects_nsb.cwt:588. */
  "every_subject_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on unit leaders that fulfills the "limit" trigger. CWT: Config/effects.cwt:2237. */
  "every_unit_leader"(value: CwtNode): void;
  /**  CWT: Config/scopes.cwt:83. */
  "faction_leader"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Finalizes border war between two states, wins or cancels it. CWT: Config/effects.cwt:2711. */
  "finalize_border_war"(value: { "attacker": StateRef; "defender": StateRef; "attacker_win"?: boolean; "defender_win"?: boolean } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/effects.cwt:3261. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/effects.cwt:3247. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array. CWT: Config/effects.cwt:3042. */
  "for_each_loop"(value: CwtNode): void;
  /** Runs a loop on for each element of an array and changes scope to current element in each iteration. CWT: Config/effects.cwt:3068. */
  "for_each_scope_loop"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Runs a same effects through a loop. example will run the effects for value_name = -3, 0, 3, 6, 9 and then terminate. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. Consider using for_each_loop instead. CWT: Config/effects.cwt:3175. */
  "for_loop_effect"(value: CwtNode): void;
  /** Updates the modifiers in current scope (use if you don't want to wait for daily update to update them). CWT: Config/effects.cwt:3099. */
  "force_update_dynamic_modifier"(value: true): void;
  /** This is to force the update of a custom map mode. CWT: Config/effects_nsb.cwt:706. */
  "force_update_map_mode"(value: { "mapmode": string } | CwtNode): void;
  /** Free an operative. Can be used from a scope and a target that is either a country or a unit leader. CWT: Config/effects_new.cwt:38. */
  "free_operative"(value: string): void;
  /** Free an operative. Can be used from a scope and a target that is either a country or a unit leader. CWT: Config/effects_new.cwt:42. */
  "free_operative"(value: CwtOpaque): void;
  /** Free a random captured operative of a certain tag by a certain tag. Can be used from a country scope of the operative in question.`all` is optional, default value is no - if set to yes it will free all operatives captured by the target country. CWT: Config/effects_new.cwt:57. */
  "free_random_operative"(value: { "captured_by": CountryRef; "all"?: boolean } | CwtNode): void;
  /** Effect not shown in tooltips Grant experience to the scoped in unit leader. Cannot be used to remove experience. The unit leader is promoted to the next skill level if applicable CWT: Config/effects_new.cwt:7. */
  "gain_xp"(value: number): void;
  /** Generate character CWT: Config/effects_nsb.cwt:724. */
  "generate_character"(value: { "token_base": string; "name"?: string; "advisor"?: { "slot": string; "name"?: string; "desc"?: string; "idea_token"?: string; "allowed"?: CwtNode; "visible"?: CwtNode; "available"?: CwtNode; "traits": readonly (string)[]; "research_bonus"?: CwtNode; "ledger"?: string; "cost"?: number; "removal_cost"?: number; "ai_will_do"?: CwtNode; "on_add"?: CwtNode; "on_remove"?: CwtNode; "do_effect"?: CwtNode; "modifier"?: CwtNode; "can_be_fired"?: boolean } | CwtNode; "portraits"?: CwtNode } | CwtNode): void;
  /** Generate a new character with a scientist role and recruit it in the country in scope. CWT: Config/effects_gtd.cwt:186. */
  "generate_scientist_character"(value: { "portrait"?: "GFX_portrait"; "portrait_tag_override"?: CountryRef; "gender"?: string; "skills"?: CwtNode; "traits"?: readonly (string)[] } | CwtNode): void;
  /** Calculates the highest scored country that is defined in a country scorer and sets it to a temp variable. CWT: Config/effects_new.cwt:401. */
  "get_highest_scored_country"(value: { "scorer": string; "var"?: string } | CwtNode): void;
  /** Calculates the highest scored country that is defined in a country scorer and sets it to a variable. CWT: Config/effects_new.cwt:318. */
  "get_highest_scored_country_temp"(value: { "scorer": string; "var"?: string } | CwtNode): void;
  /** Calculates & sorts all countries in a country scorer and stores them and their scores in arrays. CWT: Config/effects_new.cwt:409. */
  "get_sorted_scored_countries"(value: { "scorer": string; "array"?: string; "scores"?: string } | CwtNode): void;
  /** Calculates & sorts all countries in a country scorer and stores them and their scores in temp arrays. CWT: Config/effects_new.cwt:339. */
  "get_sorted_scored_countries_temp"(value: { "scorer": string; "array"?: string; "scores"?: string } | CwtNode): void;
  /** Sets a variable to the number of supply vehicles in stockpile or that are needed CWT: Config/effects_nsb.cwt:910. */
  "get_supply_vehicles"(value: { "var": string; "type": "truck" | "train"; "need"?: true | false } | CwtNode): void;
  /** Sets a temp variable to the number of supply vehicles in stockpile or that are needed CWT: Config/effects_nsb.cwt:925. */
  "get_supply_vehicles_temp"(value: { "var": string; "type": "truck" | "train"; "need"?: true | false } | CwtNode): void;
  /** Guarantees specified country. CWT: Config/effects.cwt:1034. */
  "give_guarantee"(value: CountryRef): void;
  /** Give market access to x CWT: Config/effects_aat.cwt:245. */
  "give_market_access"(value: CountryRef): void;
  /** Gives military access to the specified country. CWT: Config/effects.cwt:1041. */
  "give_military_access"(value: CountryRef): void;
  /** Gives rights to take resources from specified state. give_resource_rights = { receiver = <TAG> state = <id> }. CWT: Config/effects.cwt:2771. */
  "give_resource_rights"(value: { "receiver": CountryRef; "state": StateRef; "resources"?: readonly (string)[] } | CwtNode): void;
  /** Executes children effects on army leaders for every country in the world that fulfills the "limit" trigger. Better to use every_army_leader if you know the country. CWT: Config/effects.cwt:2355. */
  "global_every_army_leader"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Goes to stated province. CWT: Config/effects.cwt:1690. */
  "goto_province"(value: number): void;
  /** Goes to stated state. CWT: Config/effects.cwt:1694. */
  "goto_state"(value: StateRef): void;
  /** Effect not shown in tooltips. CWT: Config/effects.cwt:3783. */
  "hidden_effect"(value: CwtNode): void;
  /** Immediately holds an election in the target country. CWT: Config/effects.cwt:1159. */
  "hold_election"(value: CountryRef): void;
  /** A conditional effect. CWT: Config/effects.cwt:413. */
  "if"(value: CwtNode): void;
  /** Copies over technology state from target. CWT: Config/effects.cwt:2793. */
  "inherit_technology"(value: CountryRef): void;
  /** Kills a country leader and removes him completely, making the next in line the new party and country leader. CWT: Config/effects.cwt:1266. */
  "kill_country_leader"(value: boolean): void;
  /** Removes a ideology leader as leader of his party, making the next in line the new party leader. CWT: Config/effects_new.cwt:183. */
  "kill_ideology_leader"(value: string): void;
  /** Removes a ideology leader as leader of his party, making the next in line the new party leader. CWT: Config/effects_new.cwt:187. */
  "kill_ideology_leader"(value: number): void;
  /** Kills an operative. This will temporarily lock the slot they occupy. CWT: Config/effects_new.cwt:784. */
  "kill_operative"(value: CwtOpaque): void;
  /** Kills an operative. This will temporarily lock the slot they occupy. CWT: Config/effects_new.cwt:788. */
  "kill_operative"(value: { "operative": CwtOpaque } | CwtNode): void;
  /** Launch nuke at a state. usage . CWT: Config/effects.cwt:3222. */
  "launch_nuke"(value: { "province"?: number | string; "state"?: StateRef; "controller"?: CountryRef; "use_nuke"?: boolean; "nuke_type"?: string } | CwtNode): void;
  /** Country leaves the faction. CWT: Config/effects.cwt:1701. */
  "leave_faction"(value: boolean): void;
  /** Sets what focus tree a country uses, retains finished shared focuses. CWT: Config/effects.cwt:2391. */
  "load_focus_tree"(value: string): void;
  /** Sets what focus tree a country uses, retains finished shared focuses. CWT: Config/effects.cwt:2395. */
  "load_focus_tree"(value: { "tree": string; "copy_completed_from"?: CountryRef | string; "keep_completed"?: boolean } | CwtNode): void;
  /** Loads a OOB file instantly. CWT: Config/effects.cwt:1562. */
  "load_oob"(value: string): void;
  /** Print message to game.log - Can be localized. CWT: Config/effects.cwt:493. */
  "log"(value: string): void;
  /** Forces the refresh of the tree layout for the scoped country. CWT: Config/effects_new.cwt:820. */
  "mark_focus_tree_layout_dirty"(value: true): void;
  /** Forces the refresh of the hidden technologies for the scoped country CWT: Config/effects_gtd.cwt:99. */
  "mark_technology_tree_layout_dirty"(value: boolean): void;
  /** Meta effects can be used for building effects from strings and running them. following example will give Germany 42 pp. CWT: Config/effects.cwt:3214. */
  "meta_effect"(value: CwtNode): void;
  /** Modifies resource output of specific building for this country only. CWT: Config/effects.cwt:2346. */
  "modify_building_resources"(value: { "building": string; "resource": string; "amount": number } | CwtNode): void;
  /** Modify country flag. Only modifies if flag already exists. CWT: Config/effects.cwt:2081. */
  "modify_country_flag"(value: { "flag": string; "value"?: number; "days"?: number } | CwtNode): void;
  /** Modify global flag. Only modifies if flag already exists. CWT: Config/effects.cwt:2071. */
  "modify_global_flag"(value: { "flag": string; "value"?: number; "days"?: number } | CwtNode): void;
  /** Modify country bonus for specified technology sharing group. CWT: Config/effects.cwt:2032. */
  "modify_tech_sharing_bonus"(value: { "id": string; "bonus": number } | CwtNode): void;
  /** Modify amount of days of a timed idea. CWT: Config/effects.cwt:2636. */
  "modify_timed_idea"(value: { "idea": string; "days"?: number; "months"?: number; "years"?: number } | CwtNode): void;
  /** Modulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:213. */
  "modulo_temp_variable"(value: CwtNode): void;
  /** Mdulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:219. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:155. */
  "modulo_variable"(value: CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:161. */
  "modulo_variable"(value: { "var": CwtOpaque; "value": number } | CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:144. */
  "multiply_temp_variable"(value: CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:151. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:83. */
  "multiply_variable"(value: CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:87. */
  "multiply_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Add naval experience for country. CWT: Config/effects.cwt:1340. */
  "navy_experience"(value: number): void;
  /** Add air experience for country. CWT: Config/effects.cwt:1344. */
  "navy_experience"(value: string): void;
  /** Fires a news event. CWT: Config/effects.cwt:1084. */
  "news_event"(value: { "id": string; "hours"?: number; "days"?: number; "months"?: number; "random_hours"?: number; "random_days"?: number; "random"?: number | CwtNode; "tooltip"?: string } | CwtNode): void;
  /** Fires a news event. CWT: Config/effects.cwt:1130. */
  "news_event"(value: string): void;
  /**  CWT: Config/scopes.cwt:44. */
  "NOT"(value: CwtNode): void;
  /**  CWT: Config/scopes.cwt:52. */
  "OR"(value: CwtNode): void;
  /**  CWT: Config/scopes.cwt:56. */
  "OVERLORD"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on random characters that fulfills the "limit" trigger.Has to use has_ideology in limit to determine the party (with ideology group). tooltip=key can be added to override tooltip title CWT: Config/effects_nsb.cwt:941. */
  "party_leader"(value: Effect<ScopeByName["character"]> | { limit?: Trigger<ScopeByName["character"]>; effects: Effect<ScopeByName["character"]> } | CwtNode): void;
  /**  CWT: Config/effects.cwt:3800. */
  "play_song"(value: string | number | boolean | CountryRef | StateRef): void;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/effects.cwt:2572. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): void;
  /** makes character head of their ideology party CWT: Config/effects_nsb.cwt:437. */
  "promote_character"(value: string): void;
  /** makes character head of their ideology party CWT: Config/effects_nsb.cwt:446. */
  "promote_character"(value: { "character": string | "country_leader"; "ideology": string } | CwtNode): void;
  /** Promote the officer of the division to a general scope = unit CWT: Config/effects_gtd.cwt:298. */
  "promote_officer_to_general"(value: boolean): void;
  /** Puppets specified country. CWT: Config/effects.cwt:776. */
  "puppet"(value: CountryRef): void;
  /** Puppets specified country. By default, cancels the puppets existing war relations CWT: Config/effects.cwt:783. */
  "puppet"(value: { "target": CountryRef; "end_wars"?: boolean; "end_civil_wars"?: boolean } | CwtNode): void;
  /** A possible random effect that can occur. CWT: Config/effects.cwt:343. */
  "random"(value: CwtNode): void;
  /** Executes children effects on random scientists that fulfills the "limit" trigger. CWT: Config/effects_gtd.cwt:82. */
  "random_active_scientist"(value: Effect<ScopeByName["character"]> | { limit?: Trigger<ScopeByName["character"]>; effects: Effect<ScopeByName["character"]> } | CwtNode): void;
  /** Executes children effects on a random Allied Country different from the one in scope that fulfills the `limit` trigger. CWT: Config/effects_gtd.cwt:269. */
  "random_allied_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on random army leader that fulfills the "limit" trigger. CWT: Config/effects.cwt:2243. */
  "random_army_leader"(value: CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:62. */
  "random_character"(value: Effect<ScopeByName["character"]> | { limit?: Trigger<ScopeByName["character"]>; effects: Effect<ScopeByName["character"]> } | CwtNode): void;
  /** Executes children effects on random controlled state that fulfils the "limit" trigger. prioritize = { <stateID> <stateID> } to pick those states first if they fulfil the limit. CWT: Config/effects_new.cwt:802. */
  "random_controlled_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:7. */
  "random_core_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Executes children effects on random country that fulfills the "limit" trigger. CWT: Config/effects.cwt:211. */
  "random_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** random_country_division - Executes children effects on a random division that fulfill the "limit" trigger. tooltip=key can be added to override tooltip title Supported scopes: country Executes children effects on a random division that full the "limit" trigger. tooltip=key can be added to override t CWT: Config/effects_new.cwt:439. */
  "random_country_division"(value: Effect<ScopeByName["unit"]> | { limit?: Trigger<ScopeByName["unit"]>; effects: Effect<ScopeByName["unit"]> } | CwtNode): void;
  /** Executes children effects on a random country with original tag. CWT: Config/effects_new.cwt:420. */
  "random_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on random enemy country that fulfills the "limit" trigger. CWT: Config/effects.cwt:235. */
  "random_enemy_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** A list of possible random effects to trigger in this effect. CWT: Config/effects.cwt:355. */
  "random_list"(value: CwtNode): void;
  /** Executes children effects on a random Military Industrial Organisation of the country in scope, that fulfills the "limit" trigger. tooltip=key can be added to override tooltip title CWT: Config/effects_aat.cwt:236. */
  "random_military_industrial_organization"(value: Effect<ScopeByName["military_industrial_organization"]> | { limit?: Trigger<ScopeByName["military_industrial_organization"]>; effects: Effect<ScopeByName["military_industrial_organization"]> } | CwtNode): void;
  /** Executes children effects on random navy leader that fulfills the "limit" trigger. CWT: Config/effects.cwt:2255. */
  "random_navy_leader"(value: CwtNode): void;
  /** Executes children effects on random neighbor country that fulfills the "limit" trigger. CWT: Config/effects.cwt:223. */
  "random_neighbor_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on random occupied country that fulfils the "limit" trigger. CWT: Config/effects_new.cwt:350. */
  "random_occupied_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a random operatives that fulfils the "limit" trigger. CWT: Config/effects_new.cwt:133. */
  "random_operative"(value: Effect<ScopeByName["operative"]> | { limit?: Trigger<ScopeByName["operative"]>; effects: Effect<ScopeByName["operative"]> } | CwtNode): void;
  /** Executes children effects on random country that fulfills the "limit" trigger. Excludes current country. CWT: Config/effects.cwt:1892. */
  "random_other_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on random owned state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1875. */
  "random_owned_controlled_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Executes children effects on random owned state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1055. */
  "random_owned_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Executes children effects on a random purchase contract of the country in scope, that fulfills the "limit" trigger. tooltip = key need to be added to override the tooltip title CWT: Config/effects_aat.cwt:271. */
  "random_purchase_contract"(value: Effect<ScopeByName["purchase_contract"]> | { limit?: Trigger<ScopeByName["purchase_contract"]>; effects: Effect<ScopeByName["purchase_contract"]> } | CwtNode): void;
  /** Executes children effects on random scientists that fulfills the "limit" trigger. CWT: Config/effects_gtd.cwt:17. */
  "random_scientist"(value: Effect<ScopeByName["character"]> | { limit?: Trigger<ScopeByName["character"]>; effects: Effect<ScopeByName["character"]> } | CwtNode): void;
  /** Runs the effect for a random element in array. CWT: Config/effects.cwt:3082. */
  "random_scope_in_array"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on random state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1049. */
  "random_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Executes child effects on random subject country that fulfills the limit. CWT: Config/effects_nsb.cwt:593. */
  "random_subject_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on random unit leader that fulfills the "limit" trigger. CWT: Config/effects.cwt:2231. */
  "random_unit_leader"(value: CwtNode): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:194. */
  "randomize_temp_variable"(value: string): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:198. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:132. */
  "randomize_variable"(value: string): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:136. */
  "randomize_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number | string; "max"?: number | string; "lambda"?: number } | CwtNode): void;
  /** Randomize weather effect. CWT: Config/effects.cwt:570. */
  "randomize_weather"(value: number): void;
  /** Scope country recalls attache from target country. Example: GER = { recall_attache = CHI } means Germany recalls attache from China. CWT: Config/effects.cwt:2597. */
  "recall_attache"(value: CountryRef): void;
  /** The scoped in country recall the volunteers sent to the target country. CWT: Config/effects_new.cwt:862. */
  "recall_volunteers_from"(value: CountryRef): void;
  /** Recruits character. Use only in history files CWT: Config/effects_nsb.cwt:637. */
  "recruit_character"(value: string): void;
  /** Recruits character. Use only in history files CWT: Config/effects_nsb.cwt:649. */
  "recruit_character"(value: CwtOpaque): void;
  /** } &nbsp;&nbsp;&nbsp;&nbsp;cost = 15 &nbsp;&nbsp;&nbsp;&nbsp;focus = focus_to_be_reduced reduce_focus_completion_cost = { Example: The focus can be a uniform list or a single token. Reduce the cost needed to complete a specific focus. The cost accepts script constants. CWT: Config/effects_ncns.cwt:11. */
  "reduce_focus_completion_cost"(value: { "focus": string | readonly (string)[]; "cost": number } | CwtNode): void;
  /** Releases specified country as a free country. CWT: Config/effects.cwt:197. */
  "release"(value: CountryRef): void;
  /** Releases specified country with specified level of autonomy. CWT: Config/effects.cwt:1967. */
  "release_autonomy"(value: { "target": CountryRef; "autonomy_state": string | "autonomy_free"; "freedom_level"?: number; "release_non_owned_controlled"?: boolean; "force_change_controller_for_non_ally_controlled"?: boolean } | CwtNode): void;
  /** Makes the scoped country release all captured generals from the specified country kept in the specified province. If no province is specified, all generals are released. CWT: Config/effects_taog.cwt:14. */
  "release_captured_generals_from"(value: CountryRef): void;
  /** Makes the scoped country release all captured generals from the specified country kept in the specified province. If no province is specified, all generals are released. CWT: Config/effects_taog.cwt:22. */
  "release_captured_generals_from"(value: { "target": CountryRef; "province": number } | CwtNode): void;
  /** Releases specified country as a puppet using your owned or controlled states. CWT: Config/effects_new.cwt:891. */
  "release_on_controlled"(value: CountryRef): void;
  /** Releases specified country as puppet. CWT: Config/effects.cwt:1270. */
  "release_puppet"(value: CountryRef): void;
  /** Releases specified country as puppet using states you own or control. CWT: Config/effects_new.cwt:899. */
  "release_puppet_on_controlled"(value: CountryRef): void;
  /**  CWT: Config/effects_nsb.cwt:366. */
  "remove_advisor_role"(value: { "character"?: string | CwtOpaque; "slot": string } | CwtNode): void;
  /** Remove all modifiers from Balance of Power CWT: Config/effects_bba.cwt:77. */
  "remove_all_power_balance_modifiers"(value: { "id": string } | CwtNode): void;
  /**  CWT: Config/effects_bba.cwt:133. */
  "remove_civil_war_target"(value: CountryRef): void;
  /** Removes a contested owner to a state. The effect can be used either from a country or a state scope and accepts the other as parameter. CWT: Config/effects_gtd.cwt:305. */
  "remove_contested_owner"(value: StateRef): void;
  /**  CWT: Config/effects_nsb.cwt:273. */
  "remove_country_leader_role"(value: { "character"?: string | CwtOpaque; "ideology"?: string } | CwtNode): void;
  /** Remove trait from active country leader. CWT: Config/effects.cwt:617. */
  "remove_country_leader_trait"(value: string): void;
  /** Remove trait from active country leader. CWT: Config/effects.cwt:621. */
  "remove_country_leader_trait"(value: { "trait": string; "ideology"?: string } | CwtNode): void;
  /** Remove specified active decision for scope country - Does not run the remove_effect or put the decision on cooldown. Ignores fire_only_once. CWT: Config/effects.cwt:2724. */
  "remove_decision"(value: string): void;
  /** Removes decision on cooldown to reactivate or remove CWT: Config/effects_toa.cwt:35. */
  "remove_decision_on_cooldown"(value: string): void;
  /** Removes a dynamic modifier from country/state/unit leader. CWT: Config/effects.cwt:3103. */
  "remove_dynamic_modifier"(value: { "modifier": string; "scope"?: CountryRef | StateRef | string | CwtOpaque } | CwtNode): void;
  /** **WARNING - DO NOT TRY TO REMOVE FACTION MANIFEST! IT WILL CRASH THE GAME** Remove a goal from the current's country faction. CWT: Config/effects_ncns.cwt:235. */
  "remove_faction_goal"(value: string): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2869. */
  "remove_from_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2884. */
  "remove_from_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2894. */
  "remove_from_array"(value: CwtNode): void;
  /** Removes specified country from faction. CWT: Config/effects.cwt:1027. */
  "remove_from_faction"(value: CountryRef): void;
  /** Removes country from technology sharing group of specified name. CWT: Config/effects.cwt:2020. */
  "remove_from_tech_sharing_group"(value: string): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2978. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2993. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:3003. */
  "remove_from_temp_array"(value: CwtNode): void;
  /** Remove idea(s) from country. CWT: Config/effects.cwt:683. */
  "remove_ideas"(value: string): void;
  /** Remove idea(s) from country. CWT: Config/effects.cwt:686. */
  "remove_ideas"(value: readonly (string)[]): void;
  /** Remove all ideas with specified trait from country. CWT: Config/effects.cwt:1176. */
  "remove_ideas_with_trait"(value: string): void;
  /** Removes mission without running complete or timeout effects. CWT: Config/effects.cwt:2593. */
  "remove_mission"(value: string): void;
  /** Remove a specific token against against another country. CWT: Config/effects_new.cwt:245. */
  "remove_operation_token"(value: { "tag": CountryRef; "token": string } | CwtNode): void;
  /** Remove opinion modifier from target. CWT: Config/effects.cwt:461. */
  "remove_opinion_modifier"(value: { "target": CountryRef; "modifier": string } | CwtNode): void;
  /** Disable specific BOP. Check that it is assigned via has_power_balance first CWT: Config/effects_bba.cwt:21. */
  "remove_power_balance"(value: { "id": string } | CwtNode): void;
  /** Remove modifier from Balance of Power. Check if it added to BOP with has_power_balance_modifier first CWT: Config/effects_bba.cwt:70. */
  "remove_power_balance_modifier"(value: { "id": string; "modifier": string } | CwtNode): void;
  /** Remove side to BOP CWT: Config/effects_bba.cwt:34. */
  "remove_power_balance_side"(value: { "id": string; "side": string } | CwtNode): void;
  /** Removes a static modifier between current scope and target. CWT: Config/effects.cwt:2165. */
  "remove_relation_modifier"(value: { "target": CountryRef; "modifier": string } | CwtNode): void;
  /** Removes an override rule to the country's relation to other countries.The desc key can be used to supply a custom description for the effect when a named trigger is used as key CWT: Config/effects_toa.cwt:21. */
  "remove_relation_rule_override"(value: CwtNode): void;
  /** Remove resource right to state for scope country. remove_resource_rights = ID. CWT: Config/effects.cwt:2785. */
  "remove_resource_rights"(value: StateRef): void;
  /** Remove the scientist role from a character.The character can come from the scope or from an input parameter. The scientist role format is the same as in the character DB. Except the visible trigger - a scientist role created via effect cannot have triggers. CWT: Config/effects_gtd.cwt:257. */
  "remove_scientist_role"(value: { "character": string | CwtOpaque } | CwtNode): void;
  /** Remove claim on state. CWT: Config/effects.cwt:444. */
  "remove_state_claim"(value: StateRef): void;
  /** Remove core on state. CWT: Config/effects.cwt:53. */
  "remove_state_core"(value: StateRef): void;
  /** Removes either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:164. */
  "remove_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /** Removes targeted decisions or mission. CWT: Config/effects.cwt:2620. */
  "remove_targeted_decision"(value: { "target": CountryRef; "decision": string } | CwtNode): void;
  /** Removes targeted decisions or mission. CWT: Config/effects.cwt:2628. */
  "remove_targeted_decision"(value: { "target": StateRef; "decision": string } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:534. */
  "remove_trait"(value: { "character"?: string | CwtOpaque; "trait": string; "ideology"?: string; "slot"?: string } | CwtNode): void;
  /** Remove a unit leader by their legacy ID ( remove_unit_leader=ID ). CWT: Config/effects.cwt:1538. */
  "remove_unit_leader"(value: string): void;
  /** Remove unit leader role to character CWT: Config/effects_nsb.cwt:122. */
  "remove_unit_leader_role"(value: string): void;
  /** Remove unit leader role to character CWT: Config/effects_nsb.cwt:139. */
  "remove_unit_leader_role"(value: CwtOpaque): void;
  /** Remove unit leader role to character CWT: Config/effects_nsb.cwt:143. */
  "remove_unit_leader_role"(value: { "character": string | CwtOpaque } | CwtNode): void;
  /** Removes wargoals of specified type for country in scope. CWT: Config/effects_new.cwt:971. */
  "remove_wargoal"(value: { "target": CountryRef; "type": string | "all" } | CwtNode): void;
  /** Reserves a dynamic country so it won't be recycled for civil wars. A dynamic country with no owned states must be reserved after it is created and unreserved once it is no longer going to be used. CWT: Config/effects_new.cwt:314. */
  "reserve_dynamic_country"(value: boolean): void;
  /** Reset name of a province back to localization one. CWT: Config/effects.cwt:2120. */
  "reset_province_name"(value: number): void;
  /** Resizes array. CWT: Config/effects.cwt:2911. */
  "resize_array"(value: { "array": string; "value"?: number | string; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes array. CWT: Config/effects.cwt:2928. */
  "resize_array"(value: CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3023. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3035. */
  "resize_temp_array"(value: CwtNode): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:390. */
  "retire_character"(value: string): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:409. */
  "retire_character"(value: CwtOpaque): void;
  /** Retires a country leader and removes him as leader of his party, making the next in line the new party and country leader. CWT: Config/effects.cwt:1262. */
  "retire_country_leader"(value: boolean): void;
  /** Kills a ideology leader and removes him completely, making the next in line the new party leader. CWT: Config/effects.cwt:3793. */
  "retire_ideology_leader"(value: string): void;
  /** Kills a ideology leader and removes him completely, making the next in line the new party leader. CWT: Config/effects.cwt:3797. */
  "retire_ideology_leader"(value: number): void;
  /** Add opinion modifier(s) to target(s). CWT: Config/effects.cwt:1739. */
  "reverse_add_opinion_modifier"(value: { "target": CountryRef; "modifier": string } | CwtNode): void;
  /** Rounds a temporary variable. CWT: Config/variable_effects_temp.cwt:252. */
  "round_temp_variable"(value: string): void;
  /** Rounds a variable. CWT: Config/variable_effects.cwt:202. */
  "round_variable"(value: CwtOpaque): void;
  /** Save an event target. CWT: Config/effects.cwt:1356. */
  "save_event_target_as"(value: string): void;
  /** Save a global event target. CWT: Config/effects.cwt:1360. */
  "save_global_event_target_as"(value: string): void;
  /**  CWT: Config/scopes.cwt:32. */
  "scope_field"(value: CwtNode): void;
  /**  CWT: Config/effects.cwt:3803. */
  "scoped_play_song"(value: string | number | boolean | CountryRef | StateRef): void;
  /** Plays sound effect only on in current scope's player. CWT: Config/effects.cwt:3243. */
  "scoped_sound_effect"(value: string): void;
  /** BUGGED AS OF NCNS BETA. Add technology tree icons from a target tag, not in tech details. Can be used multiple times for the same tag CWT: Config/effects_ncns.cwt:138. */
  "select_tech_tree_icon_origin"(value: CountryRef): void;
  /** Issues embargo on target country. CWT: Config/effects.cwt:1578. */
  "send_embargo"(value: CountryRef): void;
  /** Sends to target scope specified amount of equipment. CWT: Config/effects.cwt:1441. */
  "send_equipment"(value: { "type"?: string; "equipment"?: string; "amount": number; "target": CountryRef; "old_prioritised"?: true } | CwtNode): void;
  /** Sends to target scope specified fraction of equipment. CWT: Config/effects_new.cwt:144. */
  "send_equipment_fraction"(value: { "target": CountryRef; "value": number } | CwtNode): void;
  /** Registers an Order of Battle (OOB) file to be loaded for a country at game start, replacing any previously registered OOB (with key "air") on that country. CWT: Config/effects.cwt:2820. */
  "set_air_oob"(value: string): void;
  /** Makes autonomy of specified level and country. CWT: Config/effects.cwt:1982. */
  "set_autonomy"(value: { "target": CountryRef; "autonomy_state": string | "autonomy_free"; "freedom_level"?: number; "end_wars"?: boolean; "end_civil_wars"?: boolean } | CwtNode): void;
  /** Makes autonomy of specified level and country. CWT: Config/effects.cwt:1999. */
  "set_autonomy"(value: { "target": CountryRef; "autonomous_state": string | "autonomy_free"; "freedom_level"?: number; "end_wars"?: boolean; "end_civil_wars"?: boolean } | CwtNode): void;
  /** Update border war properties. CWT: Config/effects.cwt:2510. */
  "set_border_war_data"(value: { "attacker": StateRef; "defender": StateRef; "attacker_modifier"?: number; "defender_modifier"?: number; "combat_width"?: number } | CwtNode): void;
  /**  CWT: Config/effects_bba.cwt:92. */
  "set_can_be_fired_in_advisor_role"(value: { "character"?: string | CwtOpaque; "slot"?: string; "value": boolean } | CwtNode): void;
  /** Move capital to state. CWT: Config/effects.cwt:31. */
  "set_capital"(value: { "state": StateRef; "remember_old_capital"?: boolean } | CwtNode): void;
  /** renames character CWT: Config/effects_nsb.cwt:419. */
  "set_character_name"(value: { "character"?: string | CwtOpaque; "name": string } | CwtNode): void;
  /** Sets the collaboration in a target country with our currently scoped country. CWT: Config/effects_new.cwt:840. */
  "set_collaboration"(value: { "target": CountryRef; "value": number } | CwtNode): void;
  /** Sets the number of convoys. CWT: Config/effects.cwt:3295. */
  "set_convoys"(value: number): void;
  /** Sets country cosmetic tag. CWT: Config/effects.cwt:2047. */
  "set_cosmetic_tag"(value: string): void;
  /** Set country flag. CWT: Config/effects.cwt:140. */
  "set_country_flag"(value: string): void;
  /** Set country flag. CWT: Config/effects.cwt:143. */
  "set_country_flag"(value: { "flag": string; "value": number; "days"?: number } | CwtNode): void;
  /** Changes the description of country leader. No tooltip is generated. CWT: Config/effects_new.cwt:935. */
  "set_country_leader_description"(value: { "desc": string; "ideology"?: string | number } | CwtNode): void;
  /** Change the ideology of active leader. CWT: Config/effects.cwt:599. */
  "set_country_leader_ideology"(value: string): void;
  /** Changes the name of country leader. No tooltip is generated. CWT: Config/effects_new.cwt:915. */
  "set_country_leader_name"(value: { "name": string; "ideology"?: string | number } | CwtNode): void;
  /** Changes the portrait of country leader. No tooltip is generated. CWT: Config/effects_new.cwt:925. */
  "set_country_leader_portrait"(value: { "portrait": string; "ideology"?: string | number } | CwtNode): void;
  /** Set division template to allow force recruiting. force_allow_recruiting defaults to true if unset CWT: Config/effects.cwt:2556. */
  "set_division_force_allow_recruiting"(value: { "division_template": string; "force_allow_recruiting"?: boolean } | CwtNode): void;
  /** Set cap for a division template. CWT: Config/effects.cwt:2543. */
  "set_division_template_cap"(value: { "division_template": string; "division_cap": number } | CwtNode): void;
  /** Set lock status for a division template. CWT: Config/effects.cwt:2536. */
  "set_division_template_lock"(value: { "division_template": string; "is_locked": boolean } | CwtNode): void;
  /** Sets the animation of a specified entity IDs are set by the create_entity effect. Animations are defined within the /Hearts of Iron IV/gfx/models/** /*.asset files. CWT: Config/effects_nsb.cwt:903. */
  "set_entity_animation"(value: { "id": string; "animation": string } | CwtNode): void;
  /** Sets the position and rotation of an entity using two coordinates. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:855. */
  "set_entity_movement"(value: { "id": string; "start": { "x": number; "y": number; "z"?: number } | CwtNode; "target": { "province": number } | CwtNode; "ratio": number; "rotation": number } | CwtNode): void;
  /** Sets the position of an existing entity. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. CWT: Config/effects_nsb.cwt:873. */
  "set_entity_position"(value: { "id": string; "x": number; "y": number; "z"?: number; "province": "enum"; "state": StateRef } | CwtNode): void;
  /** Sets the currently-facing angle of an existing entity. IDs are set by the create_entity effect. A positive change results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:887. */
  "set_entity_rotation"(value: { "id": string; "rotation": number } | CwtNode): void;
  /** Sets the size of an existing entity. IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:895. */
  "set_entity_scale"(value: { "id": string; "scale": number } | CwtNode): void;
  /** Modify allequipments by factor. CWT: Config/effects.cwt:1433. */
  "set_equipment_fraction"(value: number): void;
  /** Changes current version number for a given equipment type to N. The next equipment variant created from that type will have version number N+1. Example - set_equipment_version_number = { type = small_plane_airframe_1 version = 4 } CWT: Config/effects_goe.cwt:5. */
  "set_equipment_version_number"(value: { "type": string; "version": number } | CwtNode): void;
  /** Set current country as leader of its faction. CWT: Config/effects.cwt:2801. */
  "set_faction_leader"(value: true): void;
  /** Changes current country's faction manifest, the previous manifest is removed. CWT: Config/effects_ncns.cwt:223. */
  "set_faction_manifest"(value: string): void;
  /** Set a faction's minimal requirements for an faction member upgrade group CWT: Config/effects_ncns.cwt:172. */
  "set_faction_member_upgrade_min"(value: { "upgrade": string } | CwtNode): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:269. */
  "set_faction_military_unlocked"(value: boolean): void;
  /** Set_faction_name = NEW_LOC_KEY. Sets the faction name to whatever the new key localises to. CWT: Config/effects.cwt:2759. */
  "set_faction_name"(value: string): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:265. */
  "set_faction_research_unlocked"(value: boolean): void;
  /** Set a rule on the country's faction CWT: Config/effects_ncns.cwt:219. */
  "set_faction_rule"(value: string): void;
  /** Set current country as spy master of its faction. CWT: Config/effects_new.cwt:660. */
  "set_faction_spymaster"(value: boolean): void;
  /** Set either a faction upgrade or member upgrade for the specified tag CWT: Config/effects_ncns.cwt:178. */
  "set_faction_upgrade"(value: string): void;
  /** Set fuel for country. CWT: Config/effects.cwt:3063. */
  "set_fuel"(value: number): void;
  /** Set country's current fuel ratio relative to its capacity. CWT: Config/effects.cwt:3279. */
  "set_fuel_ratio"(value: number): void;
  /** Set global flag. CWT: Config/effects.cwt:157. */
  "set_global_flag"(value: string): void;
  /** Set global flag. CWT: Config/effects.cwt:160. */
  "set_global_flag"(value: { "flag": string; "value": number; "days"?: number } | CwtNode): void;
  /** Example: set_grand_doctrine = new_mobile_warfare Set **Grand Doctrine** for a country in scope. CWT: Config/effects_ncns.cwt:27. */
  "set_grand_doctrine"(value: string): void;
  /** Registers an Order of Battle (OOB) file to be loaded for a country at game start, replacing any previously registered OOB (with the given key) on that country. CWT: Config/effects.cwt:2805. */
  "set_keyed_oob"(value: { "key": string | number | boolean | CountryRef | StateRef; "name": string } | CwtNode): void;
  /** Set_legitimacy = 10. Sets legitimacy on scope country to specified value. Value has to be 0-100. CWT: Config/effects.cwt:2746. */
  "set_legitimacy"(value: number): void;
  /** Sets mandatory major country flag. CWT: Config/effects.cwt:1608. */
  "set_major"(value: boolean): void;
  /** Set the base cooldown (in days) after attaching a policy in the MIO policy, found in country in scope with input policy token. This changes the base value. Modifiers will still apply over it. Input value cannot be negative CWT: Config/effects_aat.cwt:149. */
  "set_mio_policy_cooldown"(value: { "policy": string; "value": number } | CwtNode): void;
  /** Set the base cost (in PP) for attaching a policy in the MIO policy, found in country in scope with input policy token. This changes the base value. Modifiers will still apply over it. Input value cannot be negative CWT: Config/effects_aat.cwt:135. */
  "set_mio_policy_cost"(value: { "policy": string; "value": number } | CwtNode): void;
  /** Transfer from one country to another for the character in scope. Note that this is not related to operative nationalities added via add_nationality. Note that for operative, this will temporarily lock their slot on the country of origin CWT: Config/effects_nsb.cwt:559. */
  "set_nationality"(value: { "target_country": CountryRef; "character": string | CwtOpaque } | CwtNode): void;
  /** Registers an Order of Battle (OOB) file to be loaded for a country at game start, replacing any previously registered OOB (with key "naval") on that country. CWT: Config/effects.cwt:2816. */
  "set_naval_oob"(value: string): void;
  /** Sets the occupation law for an occupied country, occupied state, or the default occupation law of an occupying country. CWT: Config/effects_new.cwt:998. */
  "set_occupation_law"(value: "default_law"): void;
  /** Sets the occupation law for an occupied country, occupied state, or the default occupation law of an occupying country. CWT: Config/effects_new.cwt:1002. */
  "set_occupation_law"(value: string): void;
  /** Sets the occupation law for an occupied country, occupied state, or the default occupation law of an occupying country. What differentiates this effect is that if the law is not available on the given level it will attempt to set it on a level below. I.e. if the law can't be set as the default law i CWT: Config/effects_new.cwt:1006. */
  "set_occupation_law_where_available"(value: "default_law"): void;
  /** Sets the occupation law for an occupied country, occupied state, or the default occupation law of an occupying country. What differentiates this effect is that if the law is not available on the given level it will attempt to set it on a level below. I.e. if the law can't be set as the default law i CWT: Config/effects_new.cwt:1010. */
  "set_occupation_law_where_available"(value: string): void;
  /** Registers an Order of Battle (OOB) file to be loaded for a country at game start, replacing any previously registered OOB (with no key) on that country. CWT: Config/effects.cwt:2812. */
  "set_oob"(value: string): void;
  /** Change partyname for an ideology in a country. CWT: Config/effects.cwt:1724. */
  "set_party_name"(value: { "ideology": string | number | CountryRef; "long_name": string; "name": string } | CwtNode): void;
  /** Adds rule to country's party. CWT: Config/effects.cwt:1478. */
  "set_party_rule"(value: CwtNode): void;
  /** Set properties of a political party. CWT: Config/effects.cwt:631. */
  "set_political_party"(value: { "ideology": string | number | CountryRef; "popularity": number } | CwtNode): void;
  /** Set political power for country. CWT: Config/effects.cwt:701. */
  "set_political_power"(value: number): void;
  /** Set country political status. CWT: Config/effects.cwt:641. */
  "set_politics"(value: { "ruling_party"?: string | number | CountryRef; "elections_allowed"?: boolean; "last_election"?: string; "election_frequency"?: number; "name"?: string; "long_name"?: string } | CwtNode): void;
  /** Set country political party popilarities. CWT: Config/effects.cwt:662. */
  "set_popularities"(value: CwtNode): void;
  /** set portraits for the target character. Syntax is similar to character files. CWT: Config/effects_nsb.cwt:613. */
  "set_portraits"(value: CwtNode): void;
  /** Enable Balance of Power or update its values CWT: Config/effects_bba.cwt:3. */
  "set_power_balance"(value: { "id": string; "set_default"?: boolean; "right_side"?: string; "left_side"?: string; "set_value"?: number } | CwtNode): void;
  /** Change GFX of one of the BoP sides CWT: Config/effects_bba.cwt:50. */
  "set_power_balance_gfx"(value: { "id": string; "side": string; "gfx": string | "GFX_bop_ITA_mussolini_improved_side" | "GFX_bop_ITA_mussolini_side" | "GFX_bop_ITA_democratic_side" | "GFX_bop_ITA_democratic_improved_side" } | CwtNode): void;
  /** Set controller for province. CWT: Config/effects.cwt:1601. */
  "set_province_controller"(value: number): void;
  /** Set controller for province. CWT: Config/effects.cwt:1604. */
  "set_province_controller"(value: string): void;
  /** Set_province_name = { id = <province id> name = <string> } - Set name for a province. CWT: Config/effects.cwt:2109. */
  "set_province_name"(value: { "id": number; "name": string } | CwtNode): void;
  /** Adds rule to country. CWT: Config/effects.cwt:1491. */
  "set_relation_rule"(value: CwtNode): void;
  /** Sets the number of research slots. CWT: Config/effects.cwt:1425. */
  "set_research_slots"(value: number): void;
  /** Adds rule to country. CWT: Config/effects.cwt:1461. */
  "set_rule"(value: CwtNode): void;
  /** Sets the stability to the country in scope. Example: set_stability = 80. CWT: Config/effects.cwt:2218. */
  "set_stability"(value: number): void;
  /** Set controller for state. CWT: Config/effects.cwt:794. */
  "set_state_controller"(value: StateRef): void;
  /** Set owner for state. CWT: Config/effects.cwt:767. */
  "set_state_owner"(value: StateRef): void;
  /** Example: set_sub_doctrine = mobile_infantry Activate the **Subdoctrine** for a country in scope. CWT: Config/effects_ncns.cwt:33. */
  "set_sub_doctrine"(value: string): void;
  /** Sets technology level(s) on country. CWT: Config/effects.cwt:705. */
  "set_technology"(value: CwtNode): void;
  /** # TEMP VARIABLE Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:53. */
  "set_temp_variable"(value: CwtNode): void;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:88. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:226. */
  "set_temp_variable_to_random"(value: string): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:230. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): void;
  /** Sets a truce between scope country and target for days duration. CWT: Config/effects.cwt:2653. */
  "set_truce"(value: { "target": CountryRef; "days": number } | CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:3. */
  "set_variable"(value: CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:37. */
  "set_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:168. */
  "set_variable_to_random"(value: string): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:172. */
  "set_variable_to_random"(value: { "var": string; "min"?: number | string; "max"?: number | string; "integer"?: boolean } | CwtNode): void;
  /** Sets victory point to province. CWT: Config/effects_new.cwt:964. */
  "set_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /** Sets the war support to the country in scope. Example: set_war_support = 80. CWT: Config/effects.cwt:2226. */
  "set_war_support"(value: number): void;
  /** Show what idea does. CWT: Config/effects.cwt:1760. */
  "show_ideas_tooltip"(value: string): void;
  /** Show the name of the input MIO with the name of the initial trait (if any) CWT: Config/effects_aat.cwt:104. */
  "show_mio_tooltip"(value: string): void;
  /**  CWT: Config/effects.cwt:1767. */
  "show_unit_leaders_tooltip"(value: string): void;
  /**  CWT: Config/effects.cwt:1777. */
  "show_unit_leaders_tooltip"(value: CwtOpaque): void;
  /** Plays sound effect. CWT: Config/effects.cwt:562. */
  "sound_effect"(value: string): void;
  /** Start a border war between two states. CWT: Config/effects.cwt:2450. */
  "start_border_war"(value: { "change_state_after_war": boolean; "combat_width"?: number; "minimum_duration_in_days"?: number; "attacker": { "state": StateRef; "num_provinces": number; "on_win"?: string; "on_lose"?: string; "on_cancel"?: string; "leader_score"?: CwtNode; "dig_in_factor"?: number; "terrain_factor"?: number; "modifier"?: number } | CwtNode; "defender": { "state": StateRef; "num_provinces": number; "on_win"?: string; "on_lose"?: string; "on_cancel"?: string; "modifier"?: number } | CwtNode } | CwtNode): void;
  /** Given ideology starts a civil war in the country. keep_unit_leaders specify ID of unit leaders that remain with the original country. CWT: Config/effects.cwt:1180. */
  "start_civil_war"(value: CwtNode): void;
  /** Start peace conference CWT: Config/effects_new.cwt:980. */
  "start_peace_conference"(value: { "tag": CountryRef; "score_factor": number; "message"?: string; "winner_scope"?: string; "loser_scope"?: string } | CwtNode): void;
  /** Adds a random limited use tech bonus from country of categories that is it ahead in compared to you. It must have at least one category or folder. But it can contain any number of them in any combination. Note: if a country does not have a tech to be stolen a random tech bonus will be applied based  CWT: Config/effects_new.cwt:253. */
  "steal_random_tech_bonus"(value: CwtNode): void;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:133. */
  "subtract_from_temp_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_effects_temp.cwt:140. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:75. */
  "subtract_from_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:79. */
  "subtract_from_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Swap 2 ideas. CWT: Config/effects.cwt:1917. */
  "swap_ideas"(value: { "remove_idea": string; "add_idea": string; "add_days"?: number; "days"?: number } | CwtNode): void;
  /** Swap 2 traits on current ruler. CWT: Config/effects.cwt:2728. */
  "swap_ruler_traits"(value: { "remove": string; "add": string } | CwtNode): void;
  /** Teleport the target country's railway guns to the province to which railway guns are deployed CWT: Config/effects_nsb.cwt:954. */
  "teleport_railway_guns_to_deploy_province"(value: CountryRef): void;
  /** Transfers the entire navy from scope country to target country. Does not support carriers!. CWT: Config/effects.cwt:2266. */
  "transfer_navy"(value: { "target": CountryRef; "is_government_in_exile"?: true } | CwtNode): void;
  /** Transfers ship from scope country to target country. CWT: Config/effects.cwt:2055. */
  "transfer_ship"(value: { "prefer_name"?: string | number | boolean | CountryRef | StateRef; "type": string; "target": CountryRef; "exclude_refitting"?: boolean } | CwtNode): void;
  /** Set owner and controller for state. CWT: Config/effects.cwt:801. */
  "transfer_state"(value: StateRef): void;
  /** Transfer units (air, army, navy) to another country. Also transfer the stockpiled equipment (you can set it to zero if it is undesired) as well as unit leaders. CWT: Config/effects_new.cwt:152. */
  "transfer_units_fraction"(value: { "target": CountryRef; "target_organization"?: number; "source_organization"?: number; "size"?: number; "stockpile_ratio"?: number; "army_ratio"?: number; "navy_ratio"?: number; "air_ratio"?: number; "keep_unit_leaders"?: readonly (string)[]; "keep_unit_leaders_trigger"?: CwtNode } | CwtNode): void;
  /** An operative is turned by the specified country. This transfers the operative to the target country and make it appear as killed to the country of origin (increases the death counter and lock the slot). This fires the on_action on_operative_death with as killer the target country. If the target coun CWT: Config/effects_new.cwt:870. */
  "turn_operative"(value: CwtOpaque): void;
  /** An operative is turned by the specified country. This transfers the operative to the target country and make it appear as killed to the country of origin (increases the death counter and lock the slot). This fires the on_action on_operative_death with as killer the target country. If the target coun CWT: Config/effects_new.cwt:874. */
  "turn_operative"(value: { "operative": CwtOpaque } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:45. */
  "uncomplete_national_focus"(value: { "focus": string; "uncomplete_children"?: boolean; "refund_political_power"?: boolean } | CwtNode): void;
  /** Localizes name of category and displays tooltip that shows it will be unlocked. CWT: Config/effects.cwt:2383. */
  "unlock_decision_category_tooltip"(value: string): void;
  /** Show what decision does. CWT: Config/effects.cwt:2323. */
  "unlock_decision_tooltip"(value: string): void;
  /** Show what decision does. CWT: Config/effects.cwt:2327. */
  "unlock_decision_tooltip"(value: { "decision": string; "show_effect_tooltip"?: boolean; "show_modifiers"?: boolean } | CwtNode): void;
  /** Display a tooltip saying the MIO is made available (aka unlocked). Accepts MIO token, variables or keywords CWT: Config/effects_aat.cwt:96. */
  "unlock_military_industrial_organization_tooltip"(value: string): void;
  /** Display a tooltip saying the MIO policy is made available (aka unlocked) CWT: Config/effects_aat.cwt:112. */
  "unlock_mio_policy_tooltip"(value: string): void;
  /** Display a tooltip saying the MIO policy is made available (aka unlocked) CWT: Config/effects_aat.cwt:116. */
  "unlock_mio_policy_tooltip"(value: { "policy": string; "show_modifiers"?: true | false } | CwtNode): void;
  /** Unlocks a focus for a country. CWT: Config/effects.cwt:1380. */
  "unlock_national_focus"(value: string): void;
  /** Unlocks the specified subunit for the country. CWT: Config/effects_taog.cwt:8. */
  "unlock_subunit"(value: string): void;
  /** Example: unlock_tactic = tactic_grand_banzai_charge Enables specified tactic. CWT: Config/effects_ncns.cwt:116. */
  "unlock_tactic"(value: string): void;
  /** Add an upgrade to the Intelligence Agency (must be created). CWT: Config/effects_new.cwt:643. */
  "upgrade_intelligence_agency"(value: string): void;
  /** Runs the effect as long as a trigger is true. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. CWT: Config/effects.cwt:3200. */
  "while_loop_effect"(value: CwtNode): void;
  /** White peaces the two countries if at war. CWT: Config/effects.cwt:395. */
  "white_peace"(value: CountryRef): void;
  /** White peaces the two countries if at war. CWT: Config/effects.cwt:402. */
  "white_peace"(value: { "tag": CountryRef; "tooltip"?: string; "message"?: string } | CwtNode): void;
}
export interface GeneratedCountryTriggers {
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1781. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef; "index"?: "int_variable_field_32" } | CwtNode): boolean;
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1800. */
  "add_to_temp_array"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:71. */
  "add_to_temp_variable"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:78. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Checks the number of upgrade done in the intelligence agency. CWT: Config/triggers_new.cwt:221. */
  "agency_upgrade_number"(value: number): boolean;
  /** Check if the ai controlled country has any fielded divisions for a specific role. CWT: Config/triggers.cwt:1357. */
  "ai_has_role_division"(value: string): boolean;
  /** Check if the ai controlled country has any template for a specific role. CWT: Config/triggers.cwt:1353. */
  "ai_has_role_template"(value: string): boolean;
  /** Check the ai irrationality value. CWT: Config/triggers.cwt:958. */
  "ai_irrationality"(value: number): boolean;
  /** Check what liberation desire the country has towards a specified country. CWT: Config/triggers.cwt:910. */
  "ai_liberate_desire"(value: { "target": CountryRef; "value": number } | CwtNode): boolean;
  /** Will compare towards the amount of divisions an ai wants to have. CWT: Config/triggers.cwt:1033. */
  "ai_wants_divisions"(value: number): boolean;
  /** Checks if all active scientists of the Country in scope matches the triggers. CWT: Config/triggers_gtd.cwt:49. */
  "all_active_scientist"(value: Trigger<ScopeByName["character"]> | CwtNode): boolean;
  /** Check if all allied countries meet the trigger. Does not include the country itself. CWT: Config/triggers.cwt:540. */
  "all_allied_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if all unit leaders meets the trigger. CWT: Config/triggers.cwt:1479. */
  "all_army_leader"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all characters meets the trigger. tooltip=key can be defined to override title. CWT: Config/triggers_nsb.cwt:74. */
  "all_character"(value: Trigger<ScopeByName["character"]> | CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { all_collection_elements = { ``` Example (anonymous collection): Example: *all_collection_elements = { coll CWT: Config/triggers_ncns.cwt:151. */
  "all_collection_elements"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all of the states controlled by the scope country meets the trigger. tooltip=key can be defined to override title. CWT: Config/triggers_new.cwt:277. */
  "all_controlled_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Check if all of the country's core states meet the trigger. CWT: Config/triggers_nsb.cwt:15. */
  "all_core_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Check if all countries meets the trigger. CWT: Config/triggers.cwt:223. */
  "all_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if all of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:507. */
  "all_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if all country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:195. */
  "all_country_with_original_tag"(value: CwtNode): boolean;
  /** Check if all enemy countries meet the trigger. CWT: Config/triggers.cwt:228. */
  "all_enemy_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if every country with current scoped country guarantees. CWT: Config/triggers_new.cwt:331. */
  "all_guaranteed_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if all Military Industrial Organisations of the Country in scope match the triggers. tooltip=key can be defined to override title CWT: Config/triggers_aat.cwt:131. */
  "all_military_industrial_organization"(value: Trigger<ScopeByName["military_industrial_organization"]> | CwtNode): boolean;
  /** Check if all unit leaders meets the trigger. CWT: Config/triggers.cwt:1489. */
  "all_navy_leader"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all neighbor countries meet the trigger. CWT: Config/triggers.cwt:218. */
  "all_neighbor_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if all occupied countries meets the trigger. tooltip=key can be defined to override title. CWT: Config/triggers_new.cwt:178. */
  "all_occupied_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1887. */
  "all_of"(value: CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1918. */
  "all_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all operatives meets the trigger. tooltip=key can be defined to override title. CWT: Config/triggers_new.cwt:245. */
  "all_operative_leader"(value: Trigger<ScopeByName["operative"]> | CwtNode): boolean;
  /** Check if all other countries meets the trigger. Excludes current country. CWT: Config/triggers.cwt:1100. */
  "all_other_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if all owned states meets the trigger. CWT: Config/triggers.cwt:530. */
  "all_owned_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Checks if all purchase contracts of the Country in scope matches the triggers.\ntooltip=key can be defined to override title CWT: Config/triggers_aat.cwt:146. */
  "all_purchase_contracts"(value: Trigger<ScopeByName["purchase_contract"]> | CwtNode): boolean;
  /** Checks if all scientists of the Country in scope matches the triggers. CWT: Config/triggers_gtd.cwt:9. */
  "all_scientists"(value: Trigger<ScopeByName["character"]> | CwtNode): boolean;
  /** Check if all states meets the trigger. CWT: Config/triggers.cwt:525. */
  "all_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Check if all subject countries meet the trigger. tooltip=key can be defined to override title. CWT: Config/triggers_nsb.cwt:25. */
  "all_subject_countries"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if all unit leaders meets the trigger. CWT: Config/triggers.cwt:1469. */
  "all_unit_leader"(value: CwtNode): boolean;
  /** Compares the estimated naval strength between the scope country, his allies and his enemies. CWT: Config/triggers.cwt:1456. */
  "alliance_naval_strength_ratio"(value: number): boolean;
  /** Compares the estimated army strength between the scope country, his allies and his enemies. CWT: Config/triggers.cwt:1069. */
  "alliance_strength_ratio"(value: number): boolean;
  /** Always returns specified value. CWT: Config/triggers.cwt:146. */
  "always"(value: boolean): boolean;
  /** Checks for amount manpower currently in deploymentview. amount_manpower_in_training > 10. CWT: Config/triggers.cwt:1668. */
  "amount_manpower_in_deployment_queue"(value: number): boolean;
  /** Check number of research current research slots. CWT: Config/triggers.cwt:1419. */
  "amount_research_slots"(value: number): boolean;
  /** Has current country picked specified amount of ideas. Category and slots is optional. CWT: Config/triggers.cwt:1427. */
  "amount_taken_ideas"(value: { "amount": number; "slots"?: readonly (string)[] } | CwtNode): boolean;
  /**  CWT: Config/scopes.cwt:41. */
  "AND"(value: CwtNode): boolean;
  /** Checks if at least one active scientist of the Country in scope matches the triggers. CWT: Config/triggers_gtd.cwt:44. */
  "any_active_scientist"(value: Trigger<ScopeByName["character"]> | CwtNode): boolean;
  /** Check if any allied country meets the trigger. Does not include the country itself. CWT: Config/triggers.cwt:520. */
  "any_allied_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any unit leader meets the trigger. CWT: Config/triggers.cwt:1484. */
  "any_army_leader"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any character meets the trigger. tooltip=key can be defined to override title. CWT: Config/triggers_nsb.cwt:69. */
  "any_character"(value: Trigger<ScopeByName["character"]> | CwtNode): boolean;
  /** Check if there is a claim between a country and all others. CWT: Config/triggers.cwt:875. */
  "any_claim"(value: boolean): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { any_collection_element = { ``` Example (anonymous collection): Example: *any_collection_element = { collec CWT: Config/triggers_ncns.cwt:124. */
  "any_collection_element"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any of the states controlled by the scope country meets the trigger. tooltip=key can be defined to override title. CWT: Config/triggers_new.cwt:272. */
  "any_controlled_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Check if any of the country's core states meet the trigger. CWT: Config/triggers_nsb.cwt:4. */
  "any_core_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Check if any country meets the trigger. CWT: Config/triggers.cwt:89. */
  "any_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any division in country division has fullfils the triggers CWT: Config/triggers_bba.cwt:64. */
  "any_country_division"(value: Trigger<ScopeByName["unit"]> | CwtNode): boolean;
  /** Checks if any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:533. */
  "any_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:182. */
  "any_country_with_original_tag"(value: CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:552. */
  "any_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any enemy country meets the trigger. CWT: Config/triggers.cwt:185. */
  "any_enemy_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any country with current scoped country guarantees. CWT: Config/triggers_new.cwt:326. */
  "any_guaranteed_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any neighbor country in the home area meets the trigger. CWT: Config/triggers.cwt:1090. */
  "any_home_area_neighbor_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if at least one Military Industrial Organisation of the Country in scope matches the triggers. tooltip=key can be defined to override title CWT: Config/triggers_aat.cwt:136. */
  "any_military_industrial_organization"(value: Trigger<ScopeByName["military_industrial_organization"]> | CwtNode): boolean;
  /** Check if any unit leader meets the trigger. CWT: Config/triggers.cwt:1494. */
  "any_navy_leader"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any neighbor country meets the trigger. CWT: Config/triggers.cwt:51. */
  "any_neighbor_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any any occupied meets the trigger. tooltip=key can be defined to override title. CWT: Config/triggers_new.cwt:173. */
  "any_occupied_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1871. */
  "any_of"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1908. */
  "any_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any operatives meets the trigger. tooltip=key can be defined to override title. CWT: Config/triggers_new.cwt:250. */
  "any_operative_leader"(value: Trigger<ScopeByName["operative"]> | CwtNode): boolean;
  /** Check if any other country meets the trigger. Excludes current country. CWT: Config/triggers.cwt:1095. */
  "any_other_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries (except for the current country) fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:571. */
  "any_other_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries and isn't the current country fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:590. */
  "any_other_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any owned state meets the trigger. CWT: Config/triggers.cwt:510. */
  "any_owned_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Checks if at least one Purchase contract of the Country in scope matches the triggers. tooltip=key can be defined to override title CWT: Config/triggers_aat.cwt:141. */
  "any_purchase_contract"(value: Trigger<ScopeByName["purchase_contract"]> | CwtNode): boolean;
  /** Checks if at least one scientist of the Country in scope matches the triggers. CWT: Config/triggers_gtd.cwt:4. */
  "any_scientist"(value: Trigger<ScopeByName["character"]> | CwtNode): boolean;
  /** Check if any state meets the trigger. CWT: Config/triggers.cwt:505. */
  "any_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** check if any state in the given category meets the trigger. CWT: Config/triggers_gtd.cwt:84. */
  "any_state_in"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Checks if any of the provided states fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:482. */
  "any_state_of"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Check if any subject country meets the trigger. CWT: Config/triggers_nsb.cwt:20. */
  "any_subject_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any unit leader meets the trigger. CWT: Config/triggers.cwt:1474. */
  "any_unit_leader"(value: CwtNode): boolean;
  /** Compares the warscore of all wars in a country to see if any fullfills the comparison condition 0-100 - Example any_war_score > 40. CWT: Config/triggers.cwt:560. */
  "any_war_score"(value: number): boolean;
  /** Checks for amount manpower currently the target state with option to specify a type. CWT: Config/triggers.cwt:1672. */
  "army_manpower_in_state"(value: { "state": StateRef | number; "amount": number; "type"?: string } | CwtNode): boolean;
  /** Checks if the current scope is an untouched loser within the peace conference. CWT: Config/common/peace_conference.cwt:154. */
  "c_is_untouched_loser"(value: boolean): boolean;
  /** Example: can_assign_supportive_scientist_to_faction = specialization_naval Checks if the faction from the country in scope has a free slot for a supportive scientist for the country with the specialization type CWT: Config/triggers_ncns.cwt:81. */
  "can_assign_supportive_scientist_to_faction"(value: string): boolean;
  /** Can the character be a country leader. CWT: Config/triggers_nsb.cwt:179. */
  "can_be_country_leader"(value: string): boolean;
  /** Can the character be a country leader. CWT: Config/triggers_nsb.cwt:194. */
  "can_be_country_leader"(value: CwtOpaque): boolean;
  /** Checks if a railway can be built according to specifications CWT: Config/triggers_nsb.cwt:323. */
  "can_build_railway"(value: { "path": readonly (number)[]; "build_only_on_allied"?: boolean; "fallback"?: boolean } | CwtNode): boolean;
  /** Checks if a railway can be built according to specifications CWT: Config/triggers_nsb.cwt:336. */
  "can_build_railway"(value: { "build_only_on_allied"?: boolean; "start_province": number; "target_province": number; "fallback"?: boolean } | CwtNode): boolean;
  /** Checks if a railway can be built according to specifications CWT: Config/triggers_nsb.cwt:347. */
  "can_build_railway"(value: { "build_only_on_allied"?: boolean; "start_state": StateRef; "target_state": StateRef; "fallback"?: boolean } | CwtNode): boolean;
  /** Checks if the country could potentially declare a war on the target (according to game rules, relationship, etc... ). CWT: Config/triggers_new.cwt:395. */
  "can_declare_war_on"(value: CountryRef): boolean;
  /** Check if country can research technology. CWT: Config/triggers.cwt:926. */
  "can_research"(value: string): boolean;
  /**  CWT: Config/scopes.cwt:10. */
  "capital_scope"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Check the amount of casualties a country has suffered in all of it's wars. CWT: Config/triggers.cwt:754. */
  "casualties"(value: number): boolean;
  /** Checks the casualties infliced by the speficied country to the scopped country. CWT: Config/triggers.cwt:2066. */
  "casualties_inflicted_by"(value: { "opponent": CountryRef; "thousands": number } | CwtNode): boolean;
  /** Check the amount of casualties in thousands a country has suffered in all of it's wars. CWT: Config/triggers.cwt:1947. */
  "casualties_k"(value: number): boolean;
  /** Evaluates a math expression and returns true when the result is non-zero. CWT: Config/triggers_taog.cwt:57. */
  "check_expr"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:93. */
  "check_variable"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:105. */
  "check_variable"(value: { "var": string | number | boolean | CountryRef | StateRef; "value": string | number | boolean | CountryRef | StateRef; "compare"?: string; "tooltip"?: string } | CwtNode): boolean;
  /** Civilwar target is ( for civil wars checks ). CWT: Config/triggers.cwt:1073. */
  "civilwar_target"(value: CountryRef): boolean;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_triggers_temp.cwt:190. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1844. */
  "clear_temp_array"(value: string | CwtOpaque): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1847. */
  "clear_temp_array"(value: number): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:167. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "country": CountryRef } | CwtNode): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:186. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "countries": readonly (CountryRef)[] } | CwtNode): boolean;
  /** - Example: *collection_size = { input = collection:my_awesome_collection value > 1 }* - Variables can be used - Multiple comparisons are allowed: value > x value < y - Supported operators: <, >, = (THIS IS NOT TRUE AS OF 1.17.0.7) - Comparison is inclusive, so "value > X" actually means "value >= X" CWT: Config/triggers_ncns.cwt:396. */
  "collection_size"(value: { "input": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "value": number } | CwtNode): boolean;
  /** Checks if available command power is more or less that specified value. CWT: Config/triggers.cwt:1530. */
  "command_power"(value: number): boolean;
  /** Checks if daily command power increase is more or less that specified value. CWT: Config/triggers.cwt:1534. */
  "command_power_daily"(value: number): boolean;
  /** Check if autonomy progress ratio is higher than value, example. CWT: Config/triggers.cwt:1144. */
  "compare_autonomy_progress_ratio"(value: number): boolean;
  /** Check if autonomy state is higher than other one, example. CWT: Config/triggers.cwt:1148. */
  "compare_autonomy_state"(value: string): boolean;
  /** Compares the ideology support of the country's ruling party for the ideology of the faction it wants to join Example\n```\ncompare_ideology_with_faction = {\n\tvalue > 0.5\n\tleader = FROM\n}\n```\n" CWT: Config/triggers_ncns.cwt:641. */
  "compare_ideology_with_faction"(value: { "value": number; "leader": CountryRef } | CwtNode): boolean;
  /** Compare the intel of the scoped country with the specified one. CWT: Config/triggers_new.cwt:229. */
  "compare_intel_with"(value: { "target": CountryRef; "civilian_intel"?: number; "army_intel"?: number; "navy_intel"?: number; "airforce_intel"?: number } | CwtNode): boolean;
  /** Checks conscription ratio of the country compared to target conscription ratio. CWT: Config/triggers_new.cwt:367. */
  "conscription_ratio"(value: number): boolean;
  /** Check controller for province. CWT: Config/triggers.cwt:2120. */
  "controls_province"(value: number): boolean;
  /** Check controller for state(s). CWT: Config/triggers.cwt:280. */
  "controls_state"(value: StateRef): boolean;
  /** A trigger to check convoy threat for a country. Controlled by NAVAL_CONVOY_DANGER defines. Returns a value between 0 and 1. Example: convoy_threat > 0.5. CWT: Config/triggers.cwt:2062. */
  "convoy_threat"(value: number): boolean;
  /** Compares the core (average of all occupied states) compliance value of occupied_country_tag that is occupied by the country in current scope. CWT: Config/triggers_new.cwt:90. */
  "core_compliance"(value: { "occupied_country_tag": CountryRef; "value": number } | CwtNode): boolean;
  /** Compares the core (average of all occupied states) resistance value of occupied_country_tag that is occupied by the country in current scope. CWT: Config/triggers_new.cwt:98. */
  "core_resistance"(value: { "occupied_country_tag": CountryRef; "value": number } | CwtNode): boolean;
  /** ``` } size > 500000 # Total deployed manpower manpower = yes collection = collection:my_awesome_collection count_in_collection = { } size > 10 buildings = { industrial_complex } # If multiple buildings are passed, their sum will be checked collection = collection:my_awesome_collection count_in_colle CWT: Config/triggers_ncns.cwt:224. */
  "count_in_collection"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "unit": string; "size": number; "equipment_ratio"?: number } | CwtNode): boolean;
  /** ``` } size > 500000 # Total deployed manpower manpower = yes collection = collection:my_awesome_collection count_in_collection = { } size > 10 buildings = { industrial_complex } # If multiple buildings are passed, their sum will be checked collection = collection:my_awesome_collection count_in_colle CWT: Config/triggers_ncns.cwt:262. */
  "count_in_collection"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "unit_category": string | readonly (string)[]; "size": number; "equipment_ratio"?: number } | CwtNode): boolean;
  /** ``` } size > 500000 # Total deployed manpower manpower = yes collection = collection:my_awesome_collection count_in_collection = { } size > 10 buildings = { industrial_complex } # If multiple buildings are passed, their sum will be checked collection = collection:my_awesome_collection count_in_colle CWT: Config/triggers_ncns.cwt:306. */
  "count_in_collection"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "buildings": readonly (string)[]; "size": number } | CwtNode): boolean;
  /** ``` } size > 500000 # Total deployed manpower manpower = yes collection = collection:my_awesome_collection count_in_collection = { } size > 10 buildings = { industrial_complex } # If multiple buildings are passed, their sum will be checked collection = collection:my_awesome_collection count_in_colle CWT: Config/triggers_ncns.cwt:343. */
  "count_in_collection"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "stockpile": string; "size": number } | CwtNode): boolean;
  /** ``` } size > 500000 # Total deployed manpower manpower = yes collection = collection:my_awesome_collection count_in_collection = { } size > 10 buildings = { industrial_complex } # If multiple buildings are passed, their sum will be checked collection = collection:my_awesome_collection count_in_colle CWT: Config/triggers_ncns.cwt:377. */
  "count_in_collection"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "manpower": true; "size": number } | CwtNode): boolean;
  /** Returns true if the specified number of sub-triggers return true. CWT: Config/triggers.cwt:1278. */
  "count_triggers"(value: CwtNode): boolean;
  /** Check if the specified country exist. CWT: Config/triggers.cwt:354. */
  "country_exists"(value: CountryRef): boolean;
  /** Checks the current conscription amount of the country. CWT: Config/triggers_new.cwt:375. */
  "current_conscription_amount"(value: number): boolean;
  /**  CWT: Config/triggers_gtd.cwt:153. */
  "custom_override_tooltip"(value: CwtNode): boolean;
  /** Works as an and-trigger with a custom tooltip. CWT: Config/triggers.cwt:760. */
  "custom_trigger_tooltip"(value: CwtNode): boolean;
  /** Checks for a specific date. CWT: Config/triggers.cwt:619. */
  "date"(value: string): boolean;
  /** Checks the number of days since the country last capitulated, even if it is no longer capitulated. If it has not ever capitulated, the value is extremely large. It is recommended to combine this with has_capitulated = yes when you specifically want to ignore non-active capitulations. CWT: Config/triggers_new.cwt:46. */
  "days_since_capitulated"(value: number): boolean;
  /** Evaluates a math expression and writes the numeric result to the tooltip. CWT: Config/triggers_taog.cwt:31. */
  "debug_math_expr"(value: CwtNode): boolean;
  /** Checks decryption ratio against a country. CWT: Config/triggers_new.cwt:164. */
  "decryption_progress"(value: { "target": CountryRef; "value": number } | CwtNode): boolean;
  /** Check if the difficulty is above or below specified value 0-2 (difficulty enum). Example: difficulty > 0 (above easy). CWT: Config/triggers.cwt:46. */
  "difficulty"(value: number): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:104. */
  "divide_temp_variable"(value: CwtNode): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:128. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): boolean;
  /** Checks for amount of divisions in specified state owned by current country. CWT: Config/triggers.cwt:1715. */
  "divisions_in_border_state"(value: { "type"?: string; "size": number; "state": StateRef; "border_state": StateRef } | CwtNode): boolean;
  /** Checks for amount of divisions in specified state owned by current country. CWT: Config/triggers.cwt:342. */
  "divisions_in_state"(value: { "size": number; "state": StateRef; "unit"?: string; "type"?: string } | CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:28. */
  "else"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:21. */
  "else_if"(value: CwtNode): boolean;
  /** Compares the estimated navy strength between the scope country and all its enemies. CWT: Config/triggers.cwt:1452. */
  "enemies_naval_strength_ratio"(value: number): boolean;
  /** Compares the estimated army strength between the scope country and all its enemies. CWT: Config/triggers.cwt:1116. */
  "enemies_strength_ratio"(value: number): boolean;
  /** Returns energy fulfillment on a country scope. 0 .. 1 CWT: Config/triggers_ncns.cwt:740. */
  "energy_ratio"(value: number): boolean;
  /** check cost of equipment production line CWT: Config/triggers_gtd.cwt:108. */
  "equipment_cost"(value: CwtNode): boolean;
  /** Compares estimated max armor based on intel. Example: estimated_intel_max_armor = { tag = ITA value > 1 }. CWT: Config/triggers.cwt:1403. */
  "estimated_intel_max_armor"(value: { "tag": CountryRef; "value": number } | CwtNode): boolean;
  /** Compares estimated max armor based on intel. Example: estimated_intel_max_piercing = { tag = ITA value > 1 }. CWT: Config/triggers.cwt:1411. */
  "estimated_intel_max_piercing"(value: { "tag": CountryRef; "value": number } | CwtNode): boolean;
  /** Check if the current country exist. The country of the scope you are in. Example: DEN = { exists = yes }. CWT: Config/triggers.cwt:42. */
  "exists"(value: boolean): boolean;
  /** Checks fulfillment of a faction goal for the current country's faction. value > X, supports > and <, can accept variables, can be repeated multiple times CWT: Config/triggers_ncns.cwt:447. */
  "faction_goal_fulfillment"(value: { "goal": string; "value": number } | CwtNode): boolean;
  /** Checks influence rank in the faction of the current country. Can use < or > to compare the value CWT: Config/triggers_ncns.cwt:433. */
  "faction_influence_rank"(value: number): boolean;
  /** Checks influence ratio of current country in the faction CWT: Config/triggers_ncns.cwt:421. */
  "faction_influence_ratio"(value: number): boolean;
  /** Checks influence value of current country in the faction. Can use < or > to compare the value CWT: Config/triggers_ncns.cwt:417. */
  "faction_influence_score"(value: number): boolean;
  /**  CWT: Config/scopes.cwt:30. */
  "faction_leader"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks manifest fulfillment value of current country's faction manifest. Can use < or > to compare the value CWT: Config/triggers_ncns.cwt:429. */
  "faction_manifest_fulfillment"(value: number): boolean;
  /** Checks power value of current country's faction projection. Can use < or > to compare the value CWT: Config/triggers_ncns.cwt:409. */
  "faction_power_projection"(value: number): boolean;
  /** Checkss the active faction upgrade against the specified upgrade. works with >, <, = CWT: Config/triggers_ncns.cwt:413. */
  "faction_upgrade_level"(value: string): boolean;
  /** Compares the total army fighting strength between the scope country and the one set with 'tag' CWT: Config/triggers_gtd.cwt:183. */
  "fighting_army_strength_ratio"(value: { "tag": CountryRef; "ratio": number } | CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/triggers.cwt:2006. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/triggers.cwt:1992. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** = { focus = id progress = 0.5 }. CWT: Config/triggers.cwt:791. */
  "focus_progress"(value: { "focus": string; "progress": number } | CwtNode): boolean;
  /** Check the amount of foreign garrison manpower we have. CWT: Config/triggers_new.cwt:213. */
  "foreign_manpower"(value: number): boolean;
  /** Compares the fuel ratio to a variable. CWT: Config/triggers.cwt:2050. */
  "fuel_ratio"(value: number): boolean;
  /** Returns true if all of the active game rule options allow achievements. CWT: Config/triggers.cwt:1758. */
  "game_rules_allow_achievements"(value: true): boolean;
  /** Check the amount of manpower needed by garrisons. CWT: Config/triggers_new.cwt:217. */
  "garrison_manpower_need"(value: number): boolean;
  /** Calculates the highest scored country that is defined in a country scorer and sets it to a variable. CWT: Config/triggers_new.cwt:146. */
  "get_highest_scored_country_temp"(value: { "scorer": string; "var"?: string } | CwtNode): boolean;
  /** Calculates & sorts all countries in a country scorer and stores them and their scores in temp arrays. CWT: Config/triggers_new.cwt:154. */
  "get_sorted_scored_countries_temp"(value: { "scorer": string; "array"?: string; "scores"?: string } | CwtNode): boolean;
  /** Sets a temp variable to the number of supply vehicles in stockpile or that are needed CWT: Config/triggers_nsb.cwt:424. */
  "get_supply_vehicles_temp"(value: { "var": string; "type": "truck" | "train"; "need"?: true | false } | CwtNode): boolean;
  /** Check if country gives military access to specified country. CWT: Config/triggers.cwt:496. */
  "gives_military_access_to"(value: CountryRef): boolean;
  /** Check if country has an active mission with specified ID. has_active_mission = my_test_mission. CWT: Config/triggers.cwt:1652. */
  "has_active_mission"(value: string): boolean;
  /** Checks if the country's faction has a specific active rule CWT: Config/triggers_ncns.cwt:624. */
  "has_active_rule"(value: string): boolean;
  /** Compare if the country has added above or below the specified ammount of tension. CWT: Config/triggers.cwt:899. */
  "has_added_tension_amount"(value: number): boolean;
  /** Compares current country's air experience with right side value. CWT: Config/triggers.cwt:1258. */
  "has_air_experience"(value: number): boolean;
  /** Checks if country has allowed ideas with specific traits more than limit. CWT: Config/triggers_new.cwt:427. */
  "has_allowed_idea_with_traits"(value: { "idea": string | readonly (string)[]; "limit"?: number; "ignore"?: readonly (string)[] | string; "characters"?: boolean } | CwtNode): boolean;
  /** Checks a country has annex war goal on another country. CWT: Config/triggers.cwt:930. */
  "has_annex_war_goal"(value: CountryRef): boolean;
  /** Checks if any of the generals of the scoped country is captured by another country CWT: Config/triggers_taog.cwt:49. */
  "has_any_captured_general"(value: boolean): boolean;
  /** Returns true if the game has any custom difficulty on. CWT: Config/triggers.cwt:1124. */
  "has_any_custom_difficulty_setting"(value: boolean): boolean;
  /** Checks if the scoped country has any unit leader captured by the target country CWT: Config/triggers_taog.cwt:40. */
  "has_any_general_captured_by"(value: CountryRef): boolean;
  /**  CWT: Config/triggers_ncns.cwt:736. */
  "has_any_grand_doctrine"(value: string): boolean;
  /** Country has any active licenses. CWT: Config/triggers.cwt:1301. */
  "has_any_license"(value: boolean): boolean;
  /** Checks if country has any balance of power. CWT: Config/triggers_bba.cwt:10. */
  "has_any_power_balance"(value: boolean): boolean;
  /** Check if country has leader with specified ID. Don't localize this. Tooltip only for debug. Check if country has leader with specified ID. Don't localize this. Tooltip only for debug. Check if country has leader with specified ID. Don't localize this. Tooltip only for debug. Compares current country CWT: Config/triggers.cwt:1254. */
  "has_army_experience"(value: number): boolean;
  /** Checks for amount of manpower of selected type, additionally of a specified type. CWT: Config/triggers.cwt:974. */
  "has_army_manpower"(value: { "size": number } | CwtNode): boolean;
  /** Checks for amount of divisions, additionally of a specified type CWT: Config/triggers.cwt:373. */
  "has_army_size"(value: { "size": number; "type"?: string; "unit_category"?: string } | CwtNode): boolean;
  /** Has attache from any other country. CWT: Config/triggers.cwt:1656. */
  "has_attache"(value: true): boolean;
  /** Has attache from specified country. CWT: Config/triggers.cwt:1660. */
  "has_attache_from"(value: CountryRef): boolean;
  /** Check if country currently has an autonomy state, example. CWT: Config/triggers.cwt:1140. */
  "has_autonomy_state"(value: string): boolean;
  /** Checks if country has available ideas with specific traits more than limit. Possibly causes crashes. CWT: Config/triggers.cwt:631. */
  "has_available_idea_with_traits"(value: { "idea": string | readonly (string)[]; "limit": number; "ignore"?: readonly (string)[] | string } | CwtNode): boolean;
  /**  CWT: Config/triggers_nsb.cwt:36. */
  "has_available_resources_in_country"(value: { "resource": string; "amount": number } | CwtNode): boolean;
  /** Check value of bombing_war_support. This becomes more negative as the malus grows (it won't be positive). Example bombing_war_support < 0. CWT: Config/triggers.cwt:2156. */
  "has_bombing_war_support"(value: number): boolean;
  /** Checks if a there is any border wars for country/state. CWT: Config/triggers.cwt:1582. */
  "has_border_war"(value: boolean): boolean;
  /** Checks if a there is a border war between two states. CWT: Config/triggers.cwt:1590. */
  "has_border_war_between"(value: { "attacker": StateRef; "defender": StateRef } | CwtNode): boolean;
  /** Checks if a there is a border against a state/country. CWT: Config/triggers.cwt:1599. */
  "has_border_war_with"(value: CountryRef): boolean;
  /** Checks if the country in scope has enough breakthroughs within a given specialization. CWT: Config/triggers_gtd.cwt:57. */
  "has_breakthrough_points"(value: { "specialization": string; "value": number } | CwtNode): boolean;
  /** Checks country has built a set number (at least) of a certain type of building since taking goal. CWT: Config/triggers.cwt:623. */
  "has_built"(value: { "type": string; "value": number } | CwtNode): boolean;
  /** Checks if the country has capitulated. CWT: Config/triggers.cwt:970. */
  "has_capitulated"(value: boolean): boolean;
  /** Checks if a country has a captured an operative (supports scoped variables). CWT: Config/triggers_new.cwt:27. */
  "has_captured_operative"(value: CountryRef): boolean;
  /** Checks if a country has a captured an operative (supports scoped variables). CWT: Config/triggers_new.cwt:35. */
  "has_captured_operative"(value: boolean): boolean;
  /** Check value of casualties_war_support. This becomes more negative as the malus grows (it won't be positive). Example casualties_war_support < 0. CWT: Config/triggers.cwt:2140. */
  "has_casualties_war_support"(value: number): boolean;
  /** Returns true if scoped country has character. CWT: Config/triggers_nsb.cwt:96. */
  "has_character"(value: string): boolean;
  /** Returns true if scoped country has character. CWT: Config/triggers_nsb.cwt:111. */
  "has_character"(value: CwtOpaque): boolean;
  /** Check if participant in civil war as revolter or target. CWT: Config/triggers.cwt:855. */
  "has_civil_war"(value: boolean): boolean;
  /** Checks the collaboration in a target country with our currently scoped country. CWT: Config/triggers_new.cwt:345. */
  "has_collaboration"(value: { "target": CountryRef; "value": number } | CwtNode): boolean;
  /**  CWT: Config/triggers_bba.cwt:138. */
  "has_completed_custom_achievement"(value: { "mod": string; "achievement": string } | CwtNode): boolean;
  /** Checks if the country's faction has successfully completed a goal. Supports both regular goals and manifests CWT: Config/triggers_ncns.cwt:437. */
  "has_completed_faction_goal"(value: string): boolean;
  /** Has country completed focus. CWT: Config/triggers.cwt:718. */
  "has_completed_focus"(value: string): boolean;
  /** Checks if the country was a member of a faction when a specific goal was completed. Persists across faction disband/recreate, unlike has_completed_faction_goal. CWT: Config/triggers_taog.cwt:27. */
  "has_completed_goal"(value: string): boolean;
  /** Example: has_completed_subdoctrine = line_of_battle Checks if the country has completed a specified **Subdoctrine** CWT: Config/triggers_ncns.cwt:52. */
  "has_completed_subdoctrine"(value: string): boolean;
  /** Example: has_completed_track = heavy_aircraft Checks if the country has completed a specified **Track** CWT: Config/triggers_ncns.cwt:62. */
  "has_completed_track"(value: string): boolean;
  /** Checks if a state has the specified country as a contested owner. The trigger can be used either from a country or a state scope and accepts the other as parameter. CWT: Config/triggers_gtd.cwt:176. */
  "has_contested_owner"(value: StateRef): boolean;
  /** Check value of convoys_war_support. This becomes more negative as the malus grows (it won't be positive). Example convoys_war_support < 0. CWT: Config/triggers.cwt:2148. */
  "has_convoys_war_support"(value: number): boolean;
  /** Has an occupation modifier that applies to average resistance/compliance. CWT: Config/triggers.cwt:2124. */
  "has_core_occupation_modifier"(value: { "occupied_country_tag": CountryRef; "modifier": string } | CwtNode): boolean;
  /** Checks if country has specific cosmetic tag set. CWT: Config/triggers.cwt:1152. */
  "has_cosmetic_tag"(value: string): boolean;
  /** Returns true if the game has any custom difficulty on the scope nation. CWT: Config/triggers.cwt:1128. */
  "has_country_custom_difficulty_setting"(value: boolean): boolean;
  /** Has country flag been set. Check flag val date set and days since set. Example: has_country_flag = test_flag. CWT: Config/triggers.cwt:60. */
  "has_country_flag"(value: string): boolean;
  /** Has country flag been set. Check flag val date set and days since set. Example: has_country_flag = test_flag. CWT: Config/triggers.cwt:65. */
  "has_country_flag"(value: { "flag": string; "value"?: number; "date"?: string; "days"?: number } | CwtNode): boolean;
  /** Check if country has leader with specified ID. Don't localize this. Tooltip only for debug. CWT: Config/triggers_nsb.cwt:134. */
  "has_country_leader"(value: { "ruling_only"?: boolean; "character": string | CwtOpaque } | CwtNode): boolean;
  /** Check if country has leader with specified ID. Don't localize this. Tooltip only for debug. CWT: Config/triggers_nsb.cwt:146. */
  "has_country_leader"(value: { "ruling_only"?: boolean; "id": number } | CwtNode): boolean;
  /** Check if country has leader with specified ID. Don't localize this. Tooltip only for debug. CWT: Config/triggers_nsb.cwt:153. */
  "has_country_leader"(value: { "ruling_only"?: boolean; "name": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Check if country has character with specified ID. CWT: Config/triggers_nsb.cwt:160. */
  "has_country_leader"(value: string): boolean;
  /** Check if country has character with specified ID. CWT: Config/triggers_nsb.cwt:175. */
  "has_country_leader"(value: CwtOpaque): boolean;
  /** Does country government (ruling party) belong to ideology group. CWT: Config/triggers.cwt:300. */
  "has_country_leader_ideology"(value: string): boolean;
  /** Check if current country has specified trait. CWT: Config/triggers.cwt:1927. */
  "has_country_leader_with_trait"(value: string): boolean;
  /** Returns true if the game has the specified custom difficulty on. CWT: Config/triggers.cwt:1120. */
  "has_custom_difficulty_setting"(value: string): boolean;
  /** Check for damaged buildings of nation. CWT: Config/triggers.cwt:1180. */
  "has_damaged_buildings"(value: boolean): boolean;
  /** Check if country has active selected decision. Does not wort with targeted decisions CWT: Config/triggers.cwt:1526. */
  "has_decision"(value: string): boolean;
  /** Is country at defensive war. CWT: Config/triggers.cwt:746. */
  "has_defensive_war"(value: boolean): boolean;
  /** One country has defensive war against other country. CWT: Config/triggers.cwt:734. */
  "has_defensive_war_with"(value: CountryRef): boolean;
  /** Checks for amount of aircrafts, additionally of a specified type. CWT: Config/triggers.cwt:568. */
  "has_deployed_air_force_size"(value: { "size"?: number; "type"?: string } | CwtNode): boolean;
  /** Check if country has a buildable non-obsolete design based on an archetype. CWT: Config/triggers_nsb.cwt:311. */
  "has_design_based_on"(value: string): boolean;
  /** Checks if player has a DLC. Example: has_dlc = "name of the dlc". CWT: Config/triggers.cwt:176. */
  "has_dlc"(value: string): boolean;
  /** Example: has_doctrine = new_mobile_warfare Checks if the country has a specified **Grand Doctrine** or **Subdoctrine** CWT: Config/triggers_ncns.cwt:42. */
  "has_doctrine"(value: string): boolean;
  /** Has country done this intelligence agency upgrade (to its highest level). CWT: Config/triggers_new.cwt:205. */
  "has_done_agency_upgrade"(value: string): boolean;
  /** Checks if scope has a dynamic modifier. CWT: Config/triggers.cwt:1959. */
  "has_dynamic_modifier"(value: { "modifier": string; "scope"?: CountryRef | StateRef | string | CwtOpaque } | CwtNode): boolean;
  /** Checks if scope has a dynamic modifier. CWT: Config/triggers.cwt:1988. */
  "has_dynamic_modifier"(value: string): boolean;
  /** Checks the country's politics on allowing elections. has_elections = yes. CWT: Config/triggers.cwt:1065. */
  "has_elections"(value: boolean): boolean;
  /** Checks if any enemy has enough naval dominance to assert control in certain strategic region. CWT: Config/triggers_ncns.cwt:471. */
  "has_enemy_naval_control"(value: string): boolean;
  /** Checks if the current country has enough political influence to become faction leader CWT: Config/triggers_ncns.cwt:636. */
  "has_enough_influence_for_leadership"(value: boolean): boolean;
  /** Checks for amount of equipment stored. CWT: Config/triggers.cwt:775. */
  "has_equipment"(value: CwtNode): boolean;
  /** Checks if current scope or global scope has the specified event target saved. CWT: Config/triggers.cwt:1570. */
  "has_event_target"(value: string): boolean;
  /** Checks if the country in scope has a facility with specialization. CWT: Config/triggers_gtd.cwt:194. */
  "has_facility_specialization"(value: string): boolean;
  /** Checks if the country's faction has an active or completed goal CWT: Config/triggers_ncns.cwt:441. */
  "has_faction_goal"(value: string): boolean;
  /** Whether the faction has unlocked the military operations CWT: Config/triggers_ncns.cwt:632. */
  "has_faction_military_unlocked"(value: boolean): boolean;
  /** Whether the faction has unlocked the research CWT: Config/triggers_ncns.cwt:628. */
  "has_faction_research_unlocked"(value: boolean): boolean;
  /** Checks if the current country is in a faction with a template CWT: Config/triggers_ncns.cwt:425. */
  "has_faction_template"(value: string): boolean;
  /** Checks if finished collecting of resources for an operation. CWT: Config/triggers_new.cwt:360. */
  "has_finished_collecting_for_operation"(value: { "target": CountryRef; "operation": string } | CwtNode): boolean;
  /** Does current country have the specified focus tree. CWT: Config/triggers.cwt:1293. */
  "has_focus_tree"(value: string): boolean;
  /** Check amount of fuel. CWT: Config/triggers.cwt:1903. */
  "has_fuel"(value: number): boolean;
  /** Check controller for state(s). CWT: Config/triggers.cwt:1266. */
  "has_full_control_of_state"(value: StateRef): boolean;
  /** Checks if a game rule is set to a particular option. CWT: Config/triggers.cwt:1751. */
  "has_game_rule"(value: { "rule": string; "option": string } | CwtNode): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:155. */
  "has_global_flag"(value: string): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:160. */
  "has_global_flag"(value: { "flag": string; "value"?: number; "date"?: string; "days"?: number } | CwtNode): boolean;
  /** Does country government (ruling party) belong to ideology group. CWT: Config/triggers.cwt:288. */
  "has_government"(value: string): boolean;
  /** Does country government (ruling party) belong to ideology group. CWT: Config/triggers.cwt:308. */
  "has_government"(value: CountryRef): boolean;
  /** Check if country has guaranteed specified country. CWT: Config/triggers.cwt:480. */
  "has_guaranteed"(value: CountryRef): boolean;
  /** Check if country has idea. CWT: Config/triggers.cwt:180. */
  "has_idea"(value: string): boolean;
  /** Check if country has idea with specified trait. CWT: Config/triggers.cwt:564. */
  "has_idea_with_trait"(value: string): boolean;
  /** Checks if the current country exceeds the faction leader in number of factories CWT: Config/triggers_ncns.cwt:467. */
  "has_industry_to_become_leader"(value: boolean): boolean;
  /** Has country created an Intelligence Agency. CWT: Config/triggers.cwt:2132. */
  "has_intelligence_agency"(value: boolean): boolean;
  /** Check scope country legitimacy 0-100. Example: has_legitimacy < 60. CWT: Config/triggers.cwt:1931. */
  "has_legitimacy"(value: number): boolean;
  /** Country has specific active license. CWT: Config/triggers.cwt:1305. */
  "has_license"(value: { "from": CountryRef; "archetype": string } | CwtNode): boolean;
  /** Country has specific active license. CWT: Config/triggers.cwt:1314. */
  "has_license"(value: { "from": CountryRef; "equipment": { "type": string; "version": number } | CwtNode } | CwtNode): boolean;
  /** Check amount of manpower. CWT: Config/triggers.cwt:415. */
  "has_manpower"(value: number): boolean;
  /** Check if manpower is enough to switch recruitment laws not to be negative. CWT: Config/triggers.cwt:903. */
  "has_manpower_for_recruit_change_to"(value: { "value": number; "group": string } | CwtNode): boolean;
  /** Checks if the current country exceeds the current faction leader and its subjects in deployed manpower CWT: Config/triggers_ncns.cwt:463. */
  "has_manpower_to_become_leader"(value: boolean): boolean;
  /** Check if the country has market access with another country. CWT: Config/triggers_gtd.cwt:128. */
  "has_market_access_with"(value: CountryRef): boolean;
  /** Example: has_mastery = { amount = 10 track = heavy_aircraft } Checks if the country has at lease X mastery in a specified **Track** CWT: Config/triggers_ncns.cwt:67. */
  "has_mastery"(value: { "amount": number; "track": string } | CwtNode): boolean;
  /** Checks if the country has reached the specified number of mastery levels (rewards) for the given subdoctrine CWT: Config/triggers_ncns.cwt:617. */
  "has_mastery_level"(value: { "amount": number; "subdoctrine": string } | CwtNode): boolean;
  /** Check country has military access to specified country. CWT: Config/triggers.cwt:488. */
  "has_military_access_to"(value: CountryRef): boolean;
  /** Checks if the Country in scope has a Military Industrial Organisation matching the input token. Can use variable as input CWT: Config/triggers_aat.cwt:28. */
  "has_military_industrial_organization"(value: string): boolean;
  /** Checks the mines planted by the country of the parent scope on the coastline of the target country. CWT: Config/triggers.cwt:2074. */
  "has_mined"(value: { "target": CountryRef; "value": number } | CwtNode): boolean;
  /** Checks if a region has amount of mines. CWT: Config/triggers.cwt:2020. */
  "has_mines"(value: { "region": string; "amount": number } | CwtNode): boolean;
  /** Checks if friendly nations and country scope together has enough naval dominance to assert control in strategic region. CWT: Config/triggers_ncns.cwt:475. */
  "has_naval_control"(value: string): boolean;
  /** Check if the scoped country has a naval invasion against the specified state. CWT: Config/triggers_gtd.cwt:64. */
  "has_naval_invasion_against_state"(value: StateRef): boolean;
  /** Check if the scoped country has a naval invasion against the specified state. CWT: Config/triggers_gtd.cwt:68. */
  "has_naval_invasion_against_state"(value: string): boolean;
  /** Check if the scoped country has a naval invasion against the specified state. CWT: Config/triggers_gtd.cwt:72. */
  "has_naval_invasion_against_state"(value: { "state": StateRef | string; "preparation"?: number; "activated"?: boolean } | CwtNode): boolean;
  /** Compares current country's navy experience with right side value. CWT: Config/triggers.cwt:1262. */
  "has_navy_experience"(value: number): boolean;
  /** Checks for amount of ships, additionally of a specified type, archetype, or sub unit definition. Example: has_navy_size = { size > 10 type = convoy }; has_navy_size = { size < 1 archetype = ship_hull_light }; has_navy_size = { size > 39 unit = heavy_cruiser }; has_navy_size = { size < 100 }. CWT: Config/triggers.cwt:385. */
  "has_navy_size"(value: { "size": number; "type"?: string; "unit"?: string; "archetype"?: string } | CwtNode): boolean;
  /** Check if country has non aggression pact with the specified country. CWT: Config/triggers.cwt:1104. */
  "has_non_aggression_pact_with"(value: CountryRef): boolean;
  /** Is country at offensive war. CWT: Config/triggers.cwt:742. */
  "has_offensive_war"(value: boolean): boolean;
  /** One country has offensive war against other country. CWT: Config/triggers.cwt:726. */
  "has_offensive_war_with"(value: CountryRef): boolean;
  /** is country at offensive war without specific ally present CWT: Config/triggers_ncns.cwt:456. */
  "has_offensive_war_without_friend"(value: CountryRef): boolean;
  /** Checks if a country has a specific token against another country. CWT: Config/triggers_new.cwt:126. */
  "has_operation_token"(value: { "tag": CountryRef; "token": string } | CwtNode): boolean;
  /** Check what opinion the country has towards a specified country. CWT: Config/triggers.cwt:197. */
  "has_opinion"(value: { "target": CountryRef; "value": number } | CwtNode): boolean;
  /** Check if a country has the opinion modifier. CWT: Config/triggers.cwt:205. */
  "has_opinion_modifier"(value: string): boolean;
  /** Check amount of political power. CWT: Config/triggers.cwt:419. */
  "has_political_power"(value: number): boolean;
  /** Checks if country has specific balance of power. CWT: Config/triggers_bba.cwt:4. */
  "has_power_balance"(value: { "id": string } | CwtNode): boolean;
  /** Checks if country has balance of power modifier. CWT: Config/triggers_bba.cwt:14. */
  "has_power_balance_modifier"(value: { "id": string; "modifier": string } | CwtNode): boolean;
  /** Checks for an existing rail connection. Uses same params as can_build_railway CWT: Config/triggers_nsb.cwt:360. */
  "has_railway_connection"(value: { "path": readonly (number)[]; "build_only_on_allied"?: boolean; "fallback"?: boolean } | CwtNode): boolean;
  /** Checks for an existing rail connection. Uses same params as can_build_railway CWT: Config/triggers_nsb.cwt:373. */
  "has_railway_connection"(value: { "build_only_on_allied"?: boolean; "start_province": number; "target_province": number; "fallback"?: boolean } | CwtNode): boolean;
  /** Checks for an existing rail connection. Uses same params as can_build_railway CWT: Config/triggers_nsb.cwt:384. */
  "has_railway_connection"(value: { "build_only_on_allied"?: boolean; "start_state": StateRef; "target_state": StateRef; "fallback"?: boolean } | CwtNode): boolean;
  /** Checks if a state contains a railway at or above the specified level. CWT: Config/triggers_nsb.cwt:29. */
  "has_railway_level"(value: { "level": number; "state": StateRef } | CwtNode): boolean;
  /** Country has specified relation modifier when dealing with _target_ county. CWT: Config/triggers.cwt:1361. */
  "has_relation_modifier"(value: { "target": CountryRef; "modifier": string } | CwtNode): boolean;
  /** Checks for amount of resources in specified state. CWT: Config/triggers.cwt:1184. */
  "has_resources_amount"(value: { "resource": string; "amount": number; "state": StateRef; "delivered"?: boolean } | CwtNode): boolean;
  /** } &nbsp;&nbsp;&nbsp;&nbsp;Note: extracted and buildings are mutually exclusive &nbsp;&nbsp;&nbsp;&nbsp;buildings = no # (optional, default: no) checks only amount from local buildings instead of country balance &nbsp;&nbsp;&nbsp;&nbsp;extracted = yes # (optional, default: no) checks extracted amount CWT: Config/triggers_ncns.cwt:16. */
  "has_resources_in_collection"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "resource": string; "amount": number; "extracted"?: false | true; "buildings"?: false | true } | CwtNode): boolean;
  /** Checks for amount of resources in country CWT: Config/triggers.cwt:2164. */
  "has_resources_in_country"(value: { "resource": string; "amount": number; "extracted"?: boolean; "buildings"?: boolean; "only_imported"?: boolean } | CwtNode): boolean;
  /**  CWT: Config/triggers_nsb.cwt:42. */
  "has_resources_rights"(value: { "state": StateRef; "resources"?: readonly (string)[] } | CwtNode): boolean;
  /** Checks if a rule set for a country. Example: has_rule = can_puppet. CWT: Config/triggers.cwt:1935. */
  "has_rule"(value: string): boolean;
  /** Checks if the country in scope has a scientist with a skill level of at least 1 in specialization. CWT: Config/triggers_gtd.cwt:190. */
  "has_scientist_specialization"(value: string): boolean;
  /** Check if country has shine effect on focus (either manually achieved or by being worked on). CWT: Config/triggers_gtd.cwt:148. */
  "has_shine_effect_on_focus"(value: string): boolean;
  /** Check value of stability 0-1. Example has_stability < 0.6. CWT: Config/triggers.cwt:1460. */
  "has_stability"(value: number): boolean;
  /** Compare the initial start date of current game. CWT: Config/triggers.cwt:615. */
  "has_start_date"(value: string): boolean;
  /** Example: has_subdoctrine_in_track = heavy_aircraft Checks if the country has any subdoctrine in a specified **Track** CWT: Config/triggers_ncns.cwt:57. */
  "has_subdoctrine_in_track"(value: string): boolean;
  /** Checks if the country has for subject the given country. CWT: Config/triggers.cwt:1743. */
  "has_subject"(value: CountryRef): boolean;
  /** Example: has_tactic = tactic_grand_banzai_charge Checks if the country has access to a Tactic CWT: Config/triggers_ncns.cwt:75. */
  "has_tactic"(value: string): boolean;
  /** Check if country has technology. CWT: Config/triggers.cwt:603. */
  "has_tech"(value: string): boolean;
  /** Checks if the country has a bonus for the specified technology or category. CWT: Config/triggers.cwt:1204. */
  "has_tech_bonus"(value: { "technology": string } | CwtNode): boolean;
  /** Checks if the country has a bonus for the specified technology or category. CWT: Config/triggers.cwt:1210. */
  "has_tech_bonus"(value: { "category": string } | CwtNode): boolean;
  /** Check if country has a division template of specific name. CWT: Config/triggers.cwt:1164. */
  "has_template"(value: string): boolean;
  /** Check if country has a division template that is majority of specific unit using AI's priorities rather than visual. CWT: Config/triggers.cwt:1297. */
  "has_template_ai_majority_unit"(value: string): boolean;
  /** Check if country has a division template that contains a specific unit. CWT: Config/triggers.cwt:942. */
  "has_template_containing_unit"(value: string): boolean;
  /** Check if country has a division template that is majority of specific unit. CWT: Config/triggers.cwt:1216. */
  "has_template_majority_unit"(value: string): boolean;
  /** Checks if a country has any province of the specified terrain type. CWT: Config/triggers_nsb.cwt:303. */
  "has_terrain"(value: string): boolean;
  /** Checks if the country has truce with the specified country CWT: Config/triggers_gtd.cwt:210. */
  "has_truce_with"(value: boolean): boolean;
  /** Checks if the country has truce with the specified country CWT: Config/triggers_gtd.cwt:214. */
  "has_truce_with"(value: CountryRef): boolean;
  /** Checks if the country has truce with the specified country CWT: Config/triggers_gtd.cwt:222. */
  "has_truce_with"(value: string): boolean;
  /** Check if country has unit leader with specified ID. Don't localize this. Tooltip only for debug. CWT: Config/triggers.cwt:1085. */
  "has_unit_leader"(value: string): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1550. */
  "has_variable"(value: string): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1554. */
  "has_variable"(value: number): boolean;
  /** Compares number of volunteers from the country. Example: has_volunteers_amount_from = { tag = ITA count > 1 }. CWT: Config/triggers.cwt:879. */
  "has_volunteers_amount_from"(value: { "tag": CountryRef; "count": number } | CwtNode): boolean;
  /** Is country at war. CWT: Config/triggers.cwt:248. */
  "has_war"(value: boolean): boolean;
  /** Check value of war_support 0-1. Example has_war_support < 0.6. CWT: Config/triggers.cwt:1464. */
  "has_war_support"(value: number): boolean;
  /** Are the countries fighting on the same side of a war. CWT: Config/triggers.cwt:962. */
  "has_war_together_with"(value: CountryRef): boolean;
  /** Is countries at war. CWT: Config/triggers.cwt:330. */
  "has_war_with"(value: CountryRef): boolean;
  /** Is countries at war. CWT: Config/triggers.cwt:338. */
  "has_war_with"(value: string): boolean;
  /** Check if tag has war with major CWT: Config/triggers_bba.cwt:116. */
  "has_war_with_major"(value: boolean): boolean;
  /** Checks if country has war with wargoal against target CWT: Config/triggers_bba.cwt:120. */
  "has_war_with_wargoal_against"(value: { "target": CountryRef; "type": string } | CwtNode): boolean;
  /** Checks if country has war with any wargoal against target CWT: Config/triggers_bba.cwt:128. */
  "has_war_with_wargoal_against"(value: CountryRef): boolean;
  /** Checks if country has a wargoal against the target. Example: ENG = { has_wargoal_against = GER }. CWT: Config/triggers.cwt:1000. */
  "has_wargoal_against"(value: CountryRef): boolean;
  /** Checks if country has a wargoal against the target. Example: ENG = { has_wargoal_against = GER }. CWT: Config/triggers.cwt:1008. */
  "has_wargoal_against"(value: { "target": CountryRef; "type"?: string } | CwtNode): boolean;
  /** Trigger not shown in tooltips. CWT: Config/triggers.cwt:2114. */
  "hidden_trigger"(value: CwtNode): boolean;
  /** Compares the ratio of total industrial capacity between the scope country and the one set with 'tag'. CWT: Config/triggers.cwt:552. */
  "ic_ratio"(value: { "tag": CountryRef; "ratio": number } | CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:14. */
  "if"(value: CwtNode): boolean;
  /** Compare the absolute, percentage based, intel level the scoped country has over the specified one. CWT: Config/triggers_new.cwt:258. */
  "intel_level_over"(value: { "target": CountryRef; "civilian_intel"?: number; "army_intel"?: number; "navy_intel"?: number } | CwtNode): boolean;
  /** Checks if the country activated their active cipher decryption bonuses. CWT: Config/triggers_new.cwt:313. */
  "is_active_decryption_bonuses_enabled"(value: CountryRef): boolean;
  /** Checks if country is AI controlled. CWT: Config/triggers.cwt:667. */
  "is_ai"(value: boolean): boolean;
  /** Checks if a country is ally with another country. Will check if two countries are same/in same faction/has subject master relation. CWT: Config/triggers_new.cwt:138. */
  "is_ally_with"(value: CountryRef): boolean;
  /** Checks if a the combatant or leader has a border war. CWT: Config/triggers.cwt:1586. */
  "is_border_war"(value: boolean): boolean;
  /** Has country an active cryptology department. CWT: Config/triggers_new.cwt:293. */
  "is_cryptology_department_active"(value: boolean): boolean;
  /** Returns true if game is in debug mode (launched with -debug argument). CWT: Config/triggers_new.cwt:86. */
  "is_debug"(value: boolean): boolean;
  /** Checks if is currently decrypting a cipher. CWT: Config/triggers_new.cwt:297. */
  "is_decrypting"(value: CountryRef): boolean;
  /** Returns true if the country is a dynamic country (tag is D01-D50). CWT: Config/triggers_nsb.cwt:307. */
  "is_dynamic_country"(value: boolean): boolean;
  /** Check if embargoed by specified country. CWT: Config/triggers.cwt:471. */
  "is_embargoed_by"(value: CountryRef): boolean;
  /** Check if embargoing specified country. CWT: Config/triggers.cwt:463. */
  "is_embargoing"(value: CountryRef): boolean;
  /** Checks if scope country is hosting an exile. CWT: Config/triggers.cwt:1707. */
  "is_exile_host"(value: boolean): boolean;
  /** Checks if scope country is a government in exile in target tag. is_exiled_in = ENG. CWT: Config/triggers.cwt:1685. */
  "is_exiled_in"(value: CountryRef): boolean;
  /** Checks if scope leader is from an exiled government. is_exiled_leader = yes. CWT: Config/triggers.cwt:1681. */
  "is_exiled_leader"(value: true): boolean;
  /** Checks if scope leader is from specified exiled government. is_exiled_leader_from = FRA. CWT: Config/triggers.cwt:1700. */
  "is_exiled_leader_from"(value: CountryRef): boolean;
  /** Check if country leads a faction. CWT: Config/triggers.cwt:451. */
  "is_faction_leader"(value: boolean): boolean;
  /** Checks if scoped unit leader, ace or country is female. CWT: Config/triggers_new.cwt:19. */
  "is_female"(value: boolean): boolean;
  /** Checks if fully decrypted a cipher. CWT: Config/triggers_new.cwt:305. */
  "is_fully_decrypted"(value: CountryRef): boolean;
  /** Checks if scope country an exiled government. CWT: Config/triggers.cwt:1711. */
  "is_government_in_exile"(value: boolean): boolean;
  /** Check if guaranteed by specified country. CWT: Config/triggers.cwt:455. */
  "is_guaranteed_by"(value: CountryRef): boolean;
  /** Check if the historical focus is active. CWT: Config/triggers.cwt:992. */
  "is_historical_focus_on"(value: boolean): boolean;
  /** Checks if scope country is hosting target tag as an exile. is_hosting_exile = FRA. CWT: Config/triggers.cwt:1693. */
  "is_hosting_exile"(value: CountryRef): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1762. */
  "is_in_array"(value: { "array": string | CwtOpaque; "value": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1769. */
  "is_in_array"(value: CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1775. */
  "is_in_array"(value: { "variable_field_32": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Check if member of any faction. CWT: Config/triggers.cwt:447. */
  "is_in_faction"(value: boolean): boolean;
  /** Check if member of same faction as specified country. CWT: Config/triggers.cwt:435. */
  "is_in_faction_with"(value: CountryRef): boolean;
  /** Check if member of same faction as specified country. CWT: Config/triggers.cwt:443. */
  "is_in_faction_with"(value: string): boolean;
  /** Checks if the country is currently in a peaceconference. CWT: Config/triggers.cwt:1081. */
  "is_in_peace_conference"(value: boolean): boolean;
  /** Checks if country is member specified technology sharing group. CWT: Config/triggers.cwt:1136. */
  "is_in_tech_sharing_group"(value: string): boolean;
  /** Check if current game is ironman. CWT: Config/triggers.cwt:611. */
  "is_ironman"(value: boolean): boolean;
  /** Checks if country is justifying a wargoal against the target. CWT: Config/triggers.cwt:1017. */
  "is_justifying_wargoal_against"(value: CountryRef): boolean;
  /** Checks if the leader is visible to its owner (is_visible trigger in the leader's script) CWT: Config/triggers_taog.cwt:7. */
  "is_leader_visible"(value: CwtOpaque): boolean;
  /** Checks if the leader is visible to its owner (is_visible trigger in the leader's script) CWT: Config/triggers_taog.cwt:10. */
  "is_leader_visible"(value: string): boolean;
  /** Is lend-leasing country. CWT: Config/triggers.cwt:691. */
  "is_lend_leasing"(value: CountryRef): boolean;
  /** Current country is licensing something to target country. CWT: Config/triggers.cwt:1345. */
  "is_licensing_any_to"(value: CountryRef): boolean;
  /** Country is licensing specific equipment to target. License is active. CWT: Config/triggers.cwt:1325. */
  "is_licensing_to"(value: { "target": CountryRef; "archetype": string } | CwtNode): boolean;
  /** Country is licensing specific equipment to target. License is active. CWT: Config/triggers.cwt:1334. */
  "is_licensing_to"(value: { "target": CountryRef; "equipment": { "type": string; "version": number } | CwtNode } | CwtNode): boolean;
  /** Check if country is a major. CWT: Config/triggers.cwt:827. */
  "is_major"(value: boolean): boolean;
  /** Check if neighbor ( controlled territory ) with specified country. CWT: Config/triggers.cwt:189. */
  "is_neighbor_of"(value: CountryRef): boolean;
  /** - Another option is to use the capital state of the tag. *FROM = { is_on_same_continent_as = 111 }* - Can use country scope. Example *GER = { is_on_same_continent_as = ITA }* Checks if the scope state is on the same continent as the given state. CWT: Config/triggers_ncns.cwt:87. */
  "is_on_same_continent_as"(value: CountryRef): boolean;
  /** - Another option is to use the capital state of the tag. *FROM = { is_on_same_continent_as = 111 }* - Can use country scope. Example *GER = { is_on_same_continent_as = ITA }* Checks if the scope state is on the same continent as the given state. CWT: Config/triggers_ncns.cwt:99. */
  "is_on_same_continent_as"(value: StateRef): boolean;
  /** Check if neighbor ( owned territory ) with specified country. CWT: Config/triggers.cwt:1025. */
  "is_owner_neighbor_of"(value: CountryRef): boolean;
  /** Checks if BOP is in certain range. CWT: Config/triggers_bba.cwt:21. */
  "is_power_balance_in_range"(value: { "id": string; "range": string } | CwtNode): boolean;
  /** Checks if country has specific balance of power side active. CWT: Config/triggers_bba.cwt:52. */
  "is_power_balance_side_active"(value: { "id": string; "side": string } | CwtNode): boolean;
  /** Checks if preparing a specific operation. CWT: Config/triggers_new.cwt:383. */
  "is_preparing_operation"(value: { "operation": string | number; "target": CountryRef } | CwtNode): boolean;
  /** Checks if the country is puppet of any other country. CWT: Config/triggers.cwt:801. */
  "is_puppet"(value: boolean): boolean;
  /** Checks if the country is puppet of specified country. CWT: Config/triggers.cwt:807. */
  "is_puppet_of"(value: CountryRef): boolean;
  /** Checks if the country is currently researching a specific technology. CWT: Config/triggers.cwt:1132. */
  "is_researching_technology"(value: string): boolean;
  /** Checks if running a specific operation. Operation can be omitted to check for any operation. CWT: Config/triggers_new.cwt:353. */
  "is_running_operation"(value: { "target": CountryRef; "operation": string } | CwtNode): boolean;
  /** Checks if the country in scope is currently researching the special project in input. CWT: Config/triggers_gtd.cwt:121. */
  "is_special_project_being_researched"(value: CwtOpaque): boolean;
  /** Checks if the country in scope is currently researching the special project in input. CWT: Config/triggers_gtd.cwt:124. */
  "is_special_project_being_researched"(value: string): boolean;
  /** WARNING - requires sp: prefix to link to the project! Checks if the country in scope has completed the special project in input. CWT: Config/triggers_gtd.cwt:114. */
  "is_special_project_completed"(value: CwtOpaque): boolean;
  /** Checks if the country in scope has completed the special project in input. CWT: Config/triggers_gtd.cwt:117. */
  "is_special_project_completed"(value: string): boolean;
  /** Check if country is Spy Master. CWT: Config/triggers_new.cwt:209. */
  "is_spymaster"(value: boolean): boolean;
  /** Is_staging_coup = yes - Returns true if current country is staging a coup in another any country. CWT: Config/triggers.cwt:1289. */
  "is_staging_coup"(value: boolean): boolean;
  /** Checks if the country is subject of any other country. CWT: Config/triggers.cwt:134. */
  "is_subject"(value: boolean): boolean;
  /** Checks if the country is subject of specified country. CWT: Config/triggers.cwt:209. */
  "is_subject_of"(value: CountryRef): boolean;
  /** Is_target_of_coup = yes - Returns true if current country is being targeted by a coup from any country. CWT: Config/triggers.cwt:1285. */
  "is_target_of_coup"(value: boolean): boolean;
  /** Check if the tutorial is active. CWT: Config/triggers.cwt:988. */
  "is_tutorial"(value: boolean): boolean;
  /** Checks researched land doctrine level. CWT: Config/triggers.cwt:607. */
  "land_doctrine_level"(value: number): boolean;
  /** All inside trigger must be true. At least one entry inside trigger must be true. Negates content of trigger. Print message to game.log - Can be localized. CWT: Config/triggers_new.cwt:15. */
  "log"(value: string): boolean;
  /** Check number of months the country has been at war CWT: Config/triggers_toa.cwt:3. */
  "longest_war_length"(value: number): boolean;
  /** Number of available manpower per factory the country has. Excluding dockyards. CWT: Config/triggers.cwt:1423. */
  "manpower_per_military_factory"(value: number): boolean;
  /** Meta triggers can be used for building triggers from strings and running them. following example will test if Germany has 42 pp. CWT: Config/triggers.cwt:1951. */
  "meta_trigger"(value: CwtNode): boolean;
  /** A trigger to check how dangerous enemy mines are for a country. Controlled by NAVAL_MINE_DANGER defines. Returns a value between 0 and 1. Example: mine_threat > 0.5. CWT: Config/triggers.cwt:2058. */
  "mine_threat"(value: number): boolean;
  /** Modulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:161. */
  "modulo_temp_variable"(value: CwtNode): boolean;
  /** Mdulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:167. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:93. */
  "multiply_temp_variable"(value: CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:100. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Compares navies of two sides. CWT: Config/triggers.cwt:2027. */
  "naval_strength_comparison"(value: { "other"?: CountryRef; "tooltip"?: string; "ratio"?: number; "sub_unit_def_weights"?: CwtNode } | CwtNode): boolean;
  /** Compares the estimated navy strength between the scope country and the one set with 'tag'. CWT: Config/triggers.cwt:1444. */
  "naval_strength_ratio"(value: { "tag": CountryRef; "ratio": number } | CwtNode): boolean;
  /** Checks network national coverage you have over a country. CWT: Config/triggers_new.cwt:411. */
  "network_national_coverage"(value: { "target": CountryRef; "value": number } | CwtNode): boolean;
  /** Checks network strength you have in a country. CWT: Config/triggers_new.cwt:106. */
  "network_strength"(value: { "target": CountryRef; "state"?: StateRef; "value": number } | CwtNode): boolean;
  /** Checks network strength you have in a country. CWT: Config/triggers_new.cwt:118. */
  "network_strength"(value: { "state": StateRef; "value": number } | CwtNode): boolean;
  /**  CWT: Config/scopes.cwt:34. */
  "NOT"(value: CwtNode): boolean;
  /** Checks if states have divisions CWT: Config/triggers_bba.cwt:96. */
  "num_battalions_in_states"(value: { "count": number; "states": readonly (StateRef)[]; "types"?: readonly (string)[]; "exclude"?: readonly (string)[] } | CwtNode): boolean;
  /** Will compare towards the amount of divisions a country has control over, if strength matters use has_army_size. CWT: Config/triggers.cwt:1274. */
  "num_divisions"(value: number): boolean;
  /** Checks if states have divisions CWT: Config/triggers_bba.cwt:76. */
  "num_divisions_in_states"(value: { "count": number; "states": readonly (StateRef)[]; "types"?: readonly (string)[]; "exclude"?: readonly (string)[] } | CwtNode): boolean;
  /** Compares the number of members in the faction for the current country. CWT: Config/triggers.cwt:1112. */
  "num_faction_members"(value: number): boolean;
  /** Will compare towards the amount of fake intel divisions a country has control over. CWT: Config/triggers_new.cwt:321. */
  "num_fake_intel_divisions"(value: number): boolean;
  /** Compares number of completed operations. CWT: Config/triggers_new.cwt:335. */
  "num_finished_operations"(value: { "operation": string; "target": CountryRef; "value": number } | CwtNode): boolean;
  /** Checks the number of operative a country can recruit right now. Note that this is not necessarily greater than zero if num_operative_slots returned a number greater than the number of operative. CWT: Config/triggers_new.cwt:289. */
  "num_free_operative_slots"(value: number): boolean;
  /** total number of nukes that are currently ready to be dropped CWT: Config/triggers_gtd.cwt:202. */
  "num_nukes_being_dropped"(value: number): boolean;
  /** number of nukes left to drop during this game tick (only useful in-between nuke drops, like in on_nuke_drop on-action, for example) CWT: Config/triggers_gtd.cwt:206. */
  "num_nukes_left_to_drop"(value: number): boolean;
  /** Check the number of states occupied by nation. CWT: Config/triggers.cwt:1176. */
  "num_occupied_states"(value: number): boolean;
  /** Check amount of available civilian factories. CWT: Config/triggers.cwt:431. */
  "num_of_available_civilian_factories"(value: number): boolean;
  /** Check amount of available military factories. CWT: Config/triggers.cwt:423. */
  "num_of_available_military_factories"(value: number): boolean;
  /** Check amount of available naval factories. CWT: Config/triggers.cwt:427. */
  "num_of_available_naval_factories"(value: number): boolean;
  /** Check amount of civilian factories. CWT: Config/triggers.cwt:403. */
  "num_of_civilian_factories"(value: number): boolean;
  /** Check amount of civilian factories available for a new project to use. CWT: Config/triggers.cwt:1566. */
  "num_of_civilian_factories_available_for_projects"(value: number): boolean;
  /** Check the number of factories in controlled states excluding any gained or lost through trade, relations, modifiers etc. CWT: Config/triggers_nsb.cwt:299. */
  "num_of_controlled_factories"(value: number): boolean;
  /** Check amount of controlled stats. CWT: Config/triggers.cwt:887. */
  "num_of_controlled_states"(value: number): boolean;
  /** Check amount of total factories. CWT: Config/triggers.cwt:787. */
  "num_of_factories"(value: number): boolean;
  /** Check amount of military factories. CWT: Config/triggers.cwt:399. */
  "num_of_military_factories"(value: number): boolean;
  /** Check amount of naval factories. CWT: Config/triggers.cwt:407. */
  "num_of_naval_factories"(value: number): boolean;
  /** Check amount of nukes. CWT: Config/triggers.cwt:411. */
  "num_of_nukes"(value: number): boolean;
  /** Checks the number of operatives the country controls. CWT: Config/triggers_new.cwt:281. */
  "num_of_operatives"(value: number): boolean;
  /** Check the number of factories in owned states excluding any gained or lost through trade, relations, modifiers etc. CWT: Config/triggers_nsb.cwt:319. */
  "num_of_owned_factories"(value: number): boolean;
  /** Check amount of supply nodes CWT: Config/triggers_nsb.cwt:420. */
  "num_of_supply_nodes"(value: number): boolean;
  /** Checks the number of available operative slots a country has. If this differs from the number of operative, this does not mean the country can recruit an operative, but that it will eventually be able to. CWT: Config/triggers_new.cwt:285. */
  "num_operative_slots"(value: number): boolean;
  /** Checks num of planes stationed in a region CWT: Config/triggers_aat.cwt:86. */
  "num_planes_stationed_in_regions"(value: { "value": number; "regions": readonly (string)[] } | CwtNode): boolean;
  /** Number of researched technologies. CWT: Config/triggers_new.cwt:423. */
  "num_researched_technologies"(value: number): boolean;
  /** Check the number of subjects of nation. CWT: Config/triggers.cwt:1156. */
  "num_subjects"(value: number): boolean;
  /** Checks how many groups a nation is a member of. CWT: Config/triggers.cwt:1160. */
  "num_tech_sharing_groups"(value: number): boolean;
  /**  CWT: Config/scopes.cwt:42. */
  "OR"(value: CwtNode): boolean;
  /** Check number of research slots at start of game. CWT: Config/triggers.cwt:996. */
  "original_research_slots"(value: number): boolean;
  /** Checks if the current scope was ever the specified country. CWT: Config/triggers.cwt:891. */
  "original_tag"(value: CountryRef): boolean;
  /**  CWT: Config/scopes.cwt:5. */
  "OVERLORD"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if the country owns any of the states in the list CWT: Config/triggers_goe.cwt:3. */
  "owns_any_state_of"(value: readonly (StateRef)[]): boolean;
  /** Check owner for state(s). CWT: Config/triggers.cwt:272. */
  "owns_state"(value: StateRef): boolean;
  /** Checks if the current scope has the specified amount in current score within the peace conference. CWT: Config/common/peace_conference.cwt:206. */
  "pc_current_score"(value: number): boolean;
  /** Checks if the current scope has had an enforced government change within the peace conference. CWT: Config/common/peace_conference.cwt:187. */
  "pc_is_forced_government"(value: boolean): boolean;
  /** Checks if the current scope has had an enforced government change within the peace conference demanded by the specified country. CWT: Config/common/peace_conference.cwt:191. */
  "pc_is_forced_government_by"(value: CountryRef): boolean;
  /** Checks if the current scope has had an enforced government change to the specified ideology group. CWT: Config/common/peace_conference.cwt:198. */
  "pc_is_forced_government_to"(value: string): boolean;
  /** Checks if the current scope has been liberated within the peace conference. CWT: Config/common/peace_conference.cwt:165. */
  "pc_is_liberated"(value: boolean): boolean;
  /** Checks if the current scope has been liberated within the peace conference by the specified country. CWT: Config/common/peace_conference.cwt:169. */
  "pc_is_liberated_by"(value: CountryRef): boolean;
  /** Checks if country is a loser in peace conference CWT: Config/common/peace_conference.cwt:150. */
  "pc_is_loser"(value: boolean): boolean;
  /** Checks if the current scope is on the same side of the peace conference as the specified country. CWT: Config/common/peace_conference.cwt:158. */
  "pc_is_on_same_side_as"(value: CountryRef): boolean;
  /** Checks if the current scope is on the winning side within the peace conference. CWT: Config/common/peace_conference.cwt:146. */
  "pc_is_on_winning_side"(value: boolean): boolean;
  /** Checks if the current scope has been puppeted within the peace conference. CWT: Config/common/peace_conference.cwt:176. */
  "pc_is_puppeted"(value: boolean): boolean;
  /** Checks if the current scope has been puppeted within the peace conference by the specified country. CWT: Config/common/peace_conference.cwt:180. */
  "pc_is_puppeted_by"(value: CountryRef): boolean;
  /** Checks if country is a winner in peace conference CWT: Config/common/peace_conference.cwt:142. */
  "pc_is_winner"(value: boolean): boolean;
  /** Checks if the current scope has the specified amount in total score within the peace conference. Can only be used for the winning countries. 1.12 CWT: Config/common/peace_conference.cwt:202. */
  "pc_total_score"(value: number): boolean;
  /** Compares the amount of turns that have passed during the peace conference with a number. CWT: Config/triggers_bba.cwt:175. */
  "pc_turn"(value: number): boolean;
  /** Checks if daily political power increase is more or less that specified value. Example: political_power_daily > 1.5. CWT: Config/triggers.cwt:548. */
  "political_power_daily"(value: number): boolean;
  /** Check the value of political power daily growth.Exacmple: political_power_growth > 0. CWT: Config/triggers.cwt:1578. */
  "political_power_growth"(value: number): boolean;
  /** Checks if BOP daily drift is more or less than certain value (> <). CWT: Config/triggers_bba.cwt:36. */
  "power_balance_daily_change"(value: { "id": string; "value": number } | CwtNode): boolean;
  /** Checks if BOP is more or less than certain value (> <). CWT: Config/triggers_bba.cwt:28. */
  "power_balance_value"(value: { "id": string; "value": number } | CwtNode): boolean;
  /** Checks if BOP weekly drift is more or less than certain value (> <). CWT: Config/triggers_bba.cwt:44. */
  "power_balance_weekly_change"(value: { "id": string; "value": number } | CwtNode): boolean;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/triggers.cwt:1635. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:143. */
  "randomize_temp_variable"(value: string): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:147. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): boolean;
  /** Checks that the country in scope has received the specified amount of expeditionary forces from the specified country. CWT: Config/triggers.cwt:2082. */
  "received_expeditionary_forces"(value: { "sender": CountryRef; "value": number } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1811. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1824. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1833. */
  "remove_from_temp_array"(value: CwtNode): boolean;
  /** Check amount of reserves. CWT: Config/triggers.cwt:76. */
  "reserves"(value: number): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1851. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1863. */
  "resize_temp_array"(value: CwtNode): boolean;
  /** Rounds a temporary variable. CWT: Config/variable_triggers_temp.cwt:200. */
  "round_temp_variable"(value: string): boolean;
  /** Check if the current scope exist. CWT: Config/triggers_gtd.cwt:104. */
  "scope_exists"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:1. */
  "scope_field"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:3. */
  "set_temp_variable"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:38. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:174. */
  "set_temp_variable_to_random"(value: string): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:178. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): boolean;
  /** Checks for amount of ships in specified area. CWT: Config/triggers.cwt:362. */
  "ships_in_area"(value: { "type"?: string; "area": string; "size": number } | CwtNode): boolean;
  /** Checks for amount of ships in specified state's ports. CWT: Config/triggers.cwt:817. */
  "ships_in_state_ports"(value: { "state": StateRef; "size": number; "type"?: string } | CwtNode): boolean;
  /** Compares the ratio of equipment archetype in stockpile vs used. a value of 2 means we have double in stockpile of what is fielded or in training. CWT: Config/triggers.cwt:1727. */
  "stockpile_ratio"(value: { "archetype": string; "ratio": number } | CwtNode): boolean;
  /** Compares the estimated army strength between the scope country and the one set with 'tag'. CWT: Config/triggers.cwt:843. */
  "strength_ratio"(value: { "tag": CountryRef; "ratio": number } | CwtNode): boolean;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:82. */
  "subtract_from_temp_variable"(value: CwtNode): boolean;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_triggers_temp.cwt:89. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Check if a country is close to surrendering. CWT: Config/triggers.cwt:544. */
  "surrender_progress"(value: number): boolean;
  /** Country tag trigger. CWT: Config/triggers.cwt:80. */
  "tag"(value: CountryRef): boolean;
  /** Checks the target conscription amount of the country. CWT: Config/triggers_new.cwt:371. */
  "target_conscription_amount"(value: number): boolean;
  /** Check the global threat value. 0-1 value. CWT: Config/triggers.cwt:142. */
  "threat"(value: number): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:706. */
  "tooltip_evaluation"(value: "eval"): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:733. */
  "tooltip_evaluation"(value: "no_eval"): boolean;
  /** Check number of months the country has been at war with X for Y months. CWT: Config/triggers_toa.cwt:7. */
  "war_length_with"(value: { "tag": CountryRef; "months": number } | CwtNode): boolean;
}
export interface GeneratedStateEffects {
  /** Starts building construction for amount of levels in specified state or province. CWT: Config/effects.cwt:954. */
  "add_building_construction"(value: { "type": string; "level": number; "instant_build"?: boolean } | CwtNode): void;
  /** Starts building construction for amount of levels in specified state or province. CWT: Config/effects.cwt:963. */
  "add_building_construction"(value: { "type": string; "level": number; "instant_build"?: boolean; "province": number | { "all_provinces"?: boolean; "limit_to_coastal"?: boolean; "limit_to_naval_base"?: boolean; "limit_to_supply_node"?: boolean; "limit_to_border"?: boolean; "limit_to_victory_point"?: boolean | number; "limit_to_border_country"?: CountryRef; "level"?: number; "first"?: boolean } | CwtNode | { "id": number; "limit_to_coastal"?: boolean; "limit_to_naval_base"?: boolean; "limit_to_supply_node"?: boolean; "limit_to_border"?: boolean; "limit_to_victory_point"?: boolean | number; "level"?: number } | CwtNode } | CwtNode): void;
  /** Add state claim by country. CWT: Config/effects.cwt:1304. */
  "add_claim_by"(value: CountryRef): void;
  /** Add compliance to a state. CWT: Config/effects_new.cwt:209. */
  "add_compliance"(value: number): void;
  /** Adds a contested owner to a state. The effect can be used either from a country or a state scope and accepts the other as parameter. CWT: Config/effects_gtd.cwt:140. */
  "add_contested_owner"(value: CountryRef): void;
  /** Add state as core of country. CWT: Config/effects.cwt:1318. */
  "add_core_of"(value: CountryRef): void;
  /** Add divisional commander xp to unit CWT: Config/effects_new.cwt:1018. */
  "add_divisional_commander_xp"(value: number): void;
  /** Adds a dynamic modifier to country/state/unit leader. CWT: Config/effects.cwt:3137. */
  "add_dynamic_modifier"(value: { "modifier": string; "scope"?: CountryRef | StateRef | string | CwtOpaque; "days"?: number } | CwtNode): void;
  /** Adds the specified equipment bonuses to the country. As description the given loc key or the name of given special project will be used. Same usage as in Ideas/National spirits CWT: Config/effects_gtd.cwt:120. */
  "add_equipment_bonus"(value: { "name"?: string; "project"?: CwtOpaque; "bonus": CwtNode } | CwtNode): void;
  /** Add extra shared building slot to state. CWT: Config/effects.cwt:1735. */
  "add_extra_state_shared_building_slots"(value: number): void;
  /** Adds manpower to the country in scope or locally on a state if in state scope. CWT: Config/effects.cwt:10. */
  "add_manpower"(value: number): void;
  /** Adds new namespace. CWT: Config/effects.cwt:761. */
  "add_namespace"(value: string | number | boolean | CountryRef | StateRef): void;
  /** Adds static modifiers to specified province. CWT: Config/effects.cwt:67. */
  "add_province_modifier"(value: { "static_modifiers": readonly (string)[]; "province": { "all_provinces": boolean; "limit_to_coastal"?: boolean; "limit_to_naval_base"?: boolean; "limit_to_border"?: boolean; "limit_to_victory_point"?: boolean | number; "first"?: boolean } | CwtNode | { "id": number } | CwtNode; "days"?: number } | CwtNode): void;
  /** Adds static modifiers to specified province. CWT: Config/effects.cwt:127. */
  "add_province_modifier"(value: CwtNode): void;
  /** Add efficiency factor to strategic region for from country. CWT: Config/effects.cwt:2342. */
  "add_region_efficiency"(value: "replace_me"): void;
  /** Add resistance to a state. CWT: Config/effects_new.cwt:205. */
  "add_resistance"(value: number): void;
  /** Adds resistance target to the scoped state. CWT: Config/effects_new.cwt:361. */
  "add_resistance_target"(value: number): void;
  /** Adds resistance target to the scoped state. CWT: Config/effects_new.cwt:364. */
  "add_resistance_target"(value: { "amount": number; "tooltip": string; "id"?: string; "days"?: number; "occupier"?: CountryRef | number | string; "occupied"?: CountryRef | number | string } | CwtNode): void;
  /** Adds resource production to state. CWT: Config/effects.cwt:1527. */
  "add_resource"(value: { "type": string; "amount": number; "show_state_in_tooltip"?: boolean } | CwtNode): void;
  /** Adds a modifier to the state. CWT: Config/effects.cwt:2101. */
  "add_state_modifier"(value: { "modifier": CwtNode } | CwtNode): void;
  /** Adds either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:154. */
  "add_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2824. */
  "add_to_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2846. */
  "add_to_array"(value: CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2943. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2965. */
  "add_to_temp_array"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:122. */
  "add_to_temp_variable"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:129. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:67. */
  "add_to_variable"(value: CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:71. */
  "add_to_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Adds victory point to province. CWT: Config/effects_new.cwt:957. */
  "add_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:51. */
  "AND"(value: CwtNode): void;
  /** Boost planning of units that are belongs to the army group/navy of this unit leader. CWT: Config/effects.cwt:2338. */
  "boost_planning"(value: number): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1372. */
  "break"(value: "none"): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1376. */
  "break"(value: true): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:844. */
  "build_railway"(value: { "path": readonly (number)[]; "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:878. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_province": number; "target_province": number; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:915. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_state": StateRef; "target_state": StateRef; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Cancel border war between two states. CWT: Config/effects.cwt:2525. */
  "cancel_border_war"(value: { "dont_fire_events"?: boolean; "attacker": StateRef; "defender": StateRef } | CwtNode): void;
  /** Cancels resistance activity for a core country. Use along with force_disable_resistance to disable resistance forever. CWT: Config/effects_new.cwt:225. */
  "cancel_resistance"(value: boolean): void;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_effects_temp.cwt:242. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): void;
  /** Clamps a variable between two a values or another variables. CWT: Config/variable_effects.cwt:188. */
  "clamp_variable"(value: { "var": CwtOpaque; "min"?: number | string; "max"?: number | string } | CwtNode): void;
  /** Clears the contents of array. CWT: Config/effects.cwt:2907. */
  "clear_array"(value: string | CwtOpaque): void;
  /** Clear a global event target. CWT: Config/effects.cwt:1364. */
  "clear_global_event_target"(value: string): void;
  /** Clear all global event targets. CWT: Config/effects.cwt:1368. */
  "clear_global_event_targets"(value: true): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3016. */
  "clear_temp_array"(value: string): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3019. */
  "clear_temp_array"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:206. */
  "clear_variable"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:210. */
  "clear_variable"(value: CwtOpaque): void;
  /** Clear global flag. CWT: Config/effects.cwt:170. */
  "clr_global_flag"(value: string): void;
  /** Clear state flag. CWT: Config/effects.cwt:821. */
  "clr_state_flag"(value: string): void;
  /** Set facility level in a random province of state and country scope. CWT: Config/effects_gtd.cwt:393. */
  "construct_building_in_random_province"(value: CwtNode): void;
  /**  CWT: Config/scopes.cwt:59. */
  "CONTROLLER"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Creates a dynamic country and runs child effects on it. CWT: Config/effects_new.cwt:327. */
  "create_dynamic_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Creates an enitity Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. For comparison, default minimum zoom level (closest to the map) is 50 units, while default maximum CWT: Config/effects_nsb.cwt:823. */
  "create_entity"(value: { "entity": string; "id"?: string; "var"?: string; "x"?: number; "y"?: number; "z"?: number; "province"?: number; "state"?: StateRef; "rotation": number; "scale": number; "min_zoom": number; "visible"?: string } | CwtNode): void;
  /** Creates a purchase contract between the countries CWT: Config/effects_aat.cwt:253. */
  "create_purchase_contract"(value: { "seller": CountryRef; "buyer": CountryRef; "civilian_factories": number; "equipment": { "type": string; "amount": number } | CwtNode } | CwtNode): void;
  /** Create railway gun effect CWT: Config/effects_nsb.cwt:713. */
  "create_railway_gun"(value: { "equipment": string; "name"?: string; "location"?: number } | CwtNode): void;
  /** Creates a unit effect, just like in OOB, from effect with specified parameters: owner, prioritize_location. CWT: Config/effects.cwt:498. */
  "create_unit"(value: { "division": string | number | boolean | CountryRef | StateRef; "owner": CountryRef; "prioritize_location"?: number; "allow_spawning_on_enemy_provs"?: boolean; "count"?: number; "officer"?: { "name"?: string; "portraits"?: { "army": { "large": string; "small": string } | CwtNode } | CwtNode } | CwtNode; "country_score"?: CwtNode; "id"?: number; "divisional_commander_xp"?: number; "acclimatization"?: CwtNode; "army_manpower"?: { "army_manpower_value"?: { "value": { "tag": CountryRef; "value": number } | CwtNode } | CwtNode; "army_manpower_need"?: { "value": { "tag": CountryRef; "value": number } | CwtNode } | CwtNode } | CwtNode } | CwtNode): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:14. */
  "custom_effect_tooltip"(value: string): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:17. */
  "custom_effect_tooltip"(value: CwtNode): void;
  /** Executes the provided effects but with a custom tooltip surpressing all tooltips from all other effects inside this block. The custom tooltip is a [bindable localization] CWT: Config/effects_gtd.cwt:318. */
  "custom_override_tooltip"(value: CwtNode): void;
  /** Damages buildings in the current state. CWT: Config/effects.cwt:1934. */
  "damage_building"(value: { "type": string; "damage": number; "province"?: number | string; "state"?: StateRef; "repair_speed_modifier"?: number } | CwtNode): void;
  /** Damages buildings in the current state. CWT: Config/effects.cwt:1948. */
  "damage_building"(value: { "tags": string | readonly (string)[]; "damage": number; "province"?: number | string; "state"?: StateRef; "repair_speed_modifier"?: number } | CwtNode): void;
  /** damages units for given conditions. no tooltip generated CWT: Config/effects_nsb.cwt:666. */
  "damage_units"(value: { "province"?: number; "state"?: StateRef; "region"?: string; "limit"?: CwtNode; "damage"?: number; "org_damage"?: number; "str_damage"?: number; "ratio"?: boolean; "template"?: string; "division_template"?: string; "army"?: boolean; "navy"?: boolean } | CwtNode): void;
  /** Destroys an existing entity IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:849. */
  "destroy_entity"(value: string): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:155. */
  "divide_temp_variable"(value: CwtNode): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:179. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:91. */
  "divide_variable"(value: CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:116. */
  "divide_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Shows just tooltip of effects. CWT: Config/effects.cwt:1510. */
  "effect_tooltip"(value: CwtNode): void;
  /** Use after (else_)if for a catch-all case. CWT: Config/effects.cwt:431. */
  "else"(value: CwtNode): void;
  /** Use after (else_)if to check other triggers only if first if fails. CWT: Config/effects.cwt:422. */
  "else_if"(value: CwtNode): void;
  /** Shows event option tooltip CWT: Config/effects.cwt:27. */
  "event_option_tooltip"(value: string): void;
  /** - Example *every_collection_element = { limit = { xxx } add_political_power = 1 } - Some collections, like 'country:faction_members', require country scope - Supports 'limit' trigger Applies arbitrary effects to all elements of a collection. Supports both anonymous and regular collections CWT: Config/effects_ncns.cwt:248. */
  "every_collection_element"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfills the "limit" trigger. CWT: Config/effects.cwt:205. */
  "every_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a all countries with original tag. tooltip=key can be defined to override tooltip title. CWT: Config/effects_new.cwt:445. */
  "every_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every neighbor state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1079. */
  "every_neighbor_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfils the "limit" trigger. Difference with every_country is that it includes countries not yet present on the map. tooltip=key can be defined to override tooltip title. CWT: Config/effects_nsb.cwt:599. */
  "every_possible_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1067. */
  "every_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /**  CWT: Config/effects_bba.cwt:116. */
  "every_state_division"(value: Effect<ScopeByName["unit"]> | { limit?: Trigger<ScopeByName["unit"]>; effects: Effect<ScopeByName["unit"]> } | CwtNode): void;
  /** Finalizes border war between two states, wins or cancels it. CWT: Config/effects.cwt:2711. */
  "finalize_border_war"(value: { "attacker": StateRef; "defender": StateRef; "attacker_win"?: boolean; "defender_win"?: boolean } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/effects.cwt:3261. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/effects.cwt:3247. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array. CWT: Config/effects.cwt:3042. */
  "for_each_loop"(value: CwtNode): void;
  /** Runs a loop on for each element of an array and changes scope to current element in each iteration. CWT: Config/effects.cwt:3068. */
  "for_each_scope_loop"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Runs a same effects through a loop. example will run the effects for value_name = -3, 0, 3, 6, 9 and then terminate. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. Consider using for_each_loop instead. CWT: Config/effects.cwt:3175. */
  "for_loop_effect"(value: CwtNode): void;
  /** Force disables resistance for scoped state CWT: Config/effects_new.cwt:546. */
  "force_disable_resistance"(value: boolean): void;
  /** Force disables resistance for scoped state. The resistance will be active even if other conditions doesn't satisfy (even if it is core or resistance check trigger is false). CWT: Config/effects_new.cwt:550. */
  "force_disable_resistance"(value: CountryRef): void;
  /** Force disables resistance for scoped state. The resistance will be active even if other conditions doesn't satisfy (even if it is core or resistance check trigger is false). CWT: Config/effects_new.cwt:558. */
  "force_disable_resistance"(value: { "clear"?: boolean; "occupier": CountryRef | number | string; "occupied"?: CountryRef | number | string } | CwtNode): void;
  /** Force disables resistance for scoped state. The resistance will be active even if other conditions doesn't satisfy (even if it is core or resistance check trigger is false). CWT: Config/effects_new.cwt:580. */
  "force_disable_resistance"(value: { "clear"?: boolean; "occupier"?: CountryRef | number | string; "occupied": CountryRef | number | string } | CwtNode): void;
  /** Force disables resistance for scoped state. The resistance will be active even if other conditions doesn't satisfy (even if it is core or resistance check trigger is false). CWT: Config/effects_new.cwt:602. */
  "force_disable_resistance"(value: { "clear": true | false; "occupier"?: CountryRef | number | string; "occupied"?: CountryRef | number | string } | CwtNode): void;
  /** Force enables resistance for scoped state. The resistance will be active even if other conditions doesn't satisfy (even if it is core or resistance check trigger is false). CWT: Config/effects_new.cwt:494. */
  "force_enable_resistance"(value: CountryRef): void;
  /** Force enables resistance for scoped state. The resistance will be active even if other conditions doesn't satisfy (even if it is core or resistance check trigger is false). CWT: Config/effects_new.cwt:502. */
  "force_enable_resistance"(value: { "clear"?: boolean; "occupier": CountryRef | number | string; "occupied"?: CountryRef | number | string } | CwtNode): void;
  /** Force enables resistance for scoped state. The resistance will be active even if other conditions doesn't satisfy (even if it is core or resistance check trigger is false). CWT: Config/effects_new.cwt:524. */
  "force_enable_resistance"(value: { "clear"?: boolean; "occupier"?: CountryRef | number | string; "occupied": CountryRef | number | string } | CwtNode): void;
  /** Updates the modifiers in current scope (use if you don't want to wait for daily update to update them). CWT: Config/effects.cwt:3099. */
  "force_update_dynamic_modifier"(value: true): void;
  /** Effect not shown in tooltips Grant experience to the scoped in unit leader. Cannot be used to remove experience. The unit leader is promoted to the next skill level if applicable CWT: Config/effects_new.cwt:7. */
  "gain_xp"(value: number): void;
  /** Executes children effects on army leaders for every country in the world that fulfills the "limit" trigger. Better to use every_army_leader if you know the country. CWT: Config/effects.cwt:2355. */
  "global_every_army_leader"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Goes to stated province. CWT: Config/effects.cwt:1690. */
  "goto_province"(value: number): void;
  /** Goes to stated state. CWT: Config/effects.cwt:1694. */
  "goto_state"(value: StateRef): void;
  /** Effect not shown in tooltips. CWT: Config/effects.cwt:3783. */
  "hidden_effect"(value: CwtNode): void;
  /** A conditional effect. CWT: Config/effects.cwt:413. */
  "if"(value: CwtNode): void;
  /** Print message to game.log - Can be localized. CWT: Config/effects.cwt:493. */
  "log"(value: string): void;
  /** Meta effects can be used for building effects from strings and running them. following example will give Germany 42 pp. CWT: Config/effects.cwt:3214. */
  "meta_effect"(value: CwtNode): void;
  /** Modify global flag. Only modifies if flag already exists. CWT: Config/effects.cwt:2071. */
  "modify_global_flag"(value: { "flag": string; "value"?: number; "days"?: number } | CwtNode): void;
  /** Modify state flag. Only modifies if flag already exists. CWT: Config/effects.cwt:2091. */
  "modify_state_flag"(value: { "flag": string; "value"?: number; "days"?: number } | CwtNode): void;
  /** Modulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:213. */
  "modulo_temp_variable"(value: CwtNode): void;
  /** Mdulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:219. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:155. */
  "modulo_variable"(value: CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:161. */
  "modulo_variable"(value: { "var": CwtOpaque; "value": number } | CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:144. */
  "multiply_temp_variable"(value: CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:151. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:83. */
  "multiply_variable"(value: CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:87. */
  "multiply_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:44. */
  "NOT"(value: CwtNode): void;
  /**  CWT: Config/scopes.cwt:52. */
  "OR"(value: CwtNode): void;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/effects.cwt:2572. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): void;
  /** Promote the officer of the division to a general scope = unit CWT: Config/effects_gtd.cwt:298. */
  "promote_officer_to_general"(value: boolean): void;
  /** Requires raid as ROOT scope. Reduce progress to the special project in state. Root scope is raid instance scope. The input value is a ratio of the total needed progress to complete the special project, i.e. a decimal number between 0 and 1. CWT: Config/effects_gtd.cwt:12. */
  "raid_reduce_project_progress_ratio"(value: number): void;
  /** A possible random effect that can occur. CWT: Config/effects.cwt:343. */
  "random"(value: CwtNode): void;
  /** Executes children effects on random country that fulfills the "limit" trigger. CWT: Config/effects.cwt:211. */
  "random_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a random country with original tag. CWT: Config/effects_new.cwt:420. */
  "random_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** A list of possible random effects to trigger in this effect. CWT: Config/effects.cwt:355. */
  "random_list"(value: CwtNode): void;
  /** Executes children effects on random neighbor state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1061. */
  "random_neighbor_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Runs the effect for a random element in array. CWT: Config/effects.cwt:3082. */
  "random_scope_in_array"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on random state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1049. */
  "random_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /**  CWT: Config/effects_bba.cwt:120. */
  "random_state_division"(value: Effect<ScopeByName["unit"]> | { limit?: Trigger<ScopeByName["unit"]>; effects: Effect<ScopeByName["unit"]> } | CwtNode): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:194. */
  "randomize_temp_variable"(value: string): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:198. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:132. */
  "randomize_variable"(value: string): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:136. */
  "randomize_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number | string; "max"?: number | string; "lambda"?: number } | CwtNode): void;
  /** Randomize weather effect. CWT: Config/effects.cwt:570. */
  "randomize_weather"(value: number): void;
  /** Removes specified building in specified state or province. CWT: Config/effects.cwt:174. */
  "remove_building"(value: { "type": string; "level": number; "province"?: number } | CwtNode): void;
  /** Removes specified building in specified state or province. CWT: Config/effects.cwt:183. */
  "remove_building"(value: { "tags": string | readonly (string)[]; "level": number; "province"?: number } | CwtNode): void;
  /** Removes state claim by country. CWT: Config/effects.cwt:1311. */
  "remove_claim_by"(value: CountryRef): void;
  /** Removes a contested owner to a state. The effect can be used either from a country or a state scope and accepts the other as parameter. CWT: Config/effects_gtd.cwt:302. */
  "remove_contested_owner"(value: CountryRef): void;
  /** Removes state as core of country. CWT: Config/effects.cwt:1325. */
  "remove_core_of"(value: CountryRef): void;
  /** Removes a dynamic modifier from country/state/unit leader. CWT: Config/effects.cwt:3103. */
  "remove_dynamic_modifier"(value: { "modifier": string; "scope"?: CountryRef | StateRef | string | CwtOpaque } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2869. */
  "remove_from_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2884. */
  "remove_from_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2894. */
  "remove_from_array"(value: CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2978. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2993. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:3003. */
  "remove_from_temp_array"(value: CwtNode): void;
  /** Removes static modifiers from specified province. CWT: Config/effects.cwt:98. */
  "remove_province_modifier"(value: { "static_modifiers": readonly (string)[]; "province": { "all_provinces": boolean; "limit_to_coastal"?: boolean; "limit_to_naval_base"?: boolean; "limit_to_border"?: boolean; "limit_to_victory_point"?: boolean | number; "first"?: boolean } | CwtNode | { "id": number } | CwtNode } | CwtNode): void;
  /** Removes static modifiers fom specified province. CWT: Config/effects.cwt:134. */
  "remove_province_modifier"(value: CwtNode): void;
  /** Removes a previously added resistance target using its id. No tooltips are generated. CWT: Config/effects_new.cwt:397. */
  "remove_resistance_target"(value: string): void;
  /** Removes either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:164. */
  "remove_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:123. */
  "remove_unit_leader_role"(value: string): void;
  /** Reset name of a province back to localization one. CWT: Config/effects.cwt:2120. */
  "reset_province_name"(value: number): void;
  /** Reset_state_name = yes - Resets the current states name to the original one. CWT: Config/effects.cwt:2124. */
  "reset_state_name"(value: true): void;
  /** Resizes array. CWT: Config/effects.cwt:2911. */
  "resize_array"(value: { "array": string; "value"?: number | string; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes array. CWT: Config/effects.cwt:2928. */
  "resize_array"(value: CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3023. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3035. */
  "resize_temp_array"(value: CwtNode): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:397. */
  "retire_character"(value: string): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:409. */
  "retire_character"(value: CwtOpaque): void;
  /** Rounds a temporary variable. CWT: Config/variable_effects_temp.cwt:252. */
  "round_temp_variable"(value: string): void;
  /** Rounds a variable. CWT: Config/variable_effects.cwt:202. */
  "round_variable"(value: CwtOpaque): void;
  /** Save an event target. CWT: Config/effects.cwt:1356. */
  "save_event_target_as"(value: string): void;
  /** Save a global event target. CWT: Config/effects.cwt:1360. */
  "save_global_event_target_as"(value: string): void;
  /**  CWT: Config/scopes.cwt:32. */
  "scope_field"(value: CwtNode): void;
  /** Starts a border war in a state with neighbouring state that also has border war. CWT: Config/effects.cwt:1429. */
  "set_border_war"(value: boolean): void;
  /** Update border war properties. CWT: Config/effects.cwt:2510. */
  "set_border_war_data"(value: { "attacker": StateRef; "defender": StateRef; "attacker_modifier"?: number; "defender_modifier"?: number; "combat_width"?: number } | CwtNode): void;
  /** Sets specific level of a building construction for amount of levels in specified state or province. CWT: Config/effects.cwt:2173. */
  "set_building_level"(value: { "type": string; "level": number; "instant_build"?: true } | CwtNode): void;
  /** Sets specific level of a building construction for amount of levels in specified state or province. CWT: Config/effects.cwt:2182. */
  "set_building_level"(value: { "type": string; "level": number; "instant_build"?: true; "province": number | { "all_provinces": boolean; "limit_to_coastal"?: boolean; "limit_to_naval_base"?: boolean; "limit_to_border"?: boolean; "level"?: number; "first"?: true } | CwtNode | { "id": number; "limit_to_coastal"?: boolean; "limit_to_naval_base"?: boolean; "limit_to_border"?: boolean; "level"?: number } | CwtNode } | CwtNode): void;
  /** Set compliance of a state. CWT: Config/effects_new.cwt:233. */
  "set_compliance"(value: number): void;
  /** Adds a limited use tech bonus. CWT: Config/effects.cwt:1417. */
  "set_demilitarized_zone"(value: boolean): void;
  /** Sets the animation of a specified entity IDs are set by the create_entity effect. Animations are defined within the /Hearts of Iron IV/gfx/models/** /*.asset files. CWT: Config/effects_nsb.cwt:903. */
  "set_entity_animation"(value: { "id": string; "animation": string } | CwtNode): void;
  /** Sets the position and rotation of an entity using two coordinates. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:855. */
  "set_entity_movement"(value: { "id": string; "start": { "x": number; "y": number; "z"?: number } | CwtNode; "target": { "province": number } | CwtNode; "ratio": number; "rotation": number } | CwtNode): void;
  /** Sets the position of an existing entity. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. CWT: Config/effects_nsb.cwt:873. */
  "set_entity_position"(value: { "id": string; "x": number; "y": number; "z"?: number; "province": "enum"; "state": StateRef } | CwtNode): void;
  /** Sets the currently-facing angle of an existing entity. IDs are set by the create_entity effect. A positive change results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:887. */
  "set_entity_rotation"(value: { "id": string; "rotation": number } | CwtNode): void;
  /** Sets the size of an existing entity. IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:895. */
  "set_entity_scale"(value: { "id": string; "scale": number } | CwtNode): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:269. */
  "set_faction_military_unlocked"(value: boolean): void;
  /** Set_faction_name = NEW_LOC_KEY. Sets the faction name to whatever the new key localises to. CWT: Config/effects.cwt:2759. */
  "set_faction_name"(value: string): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:265. */
  "set_faction_research_unlocked"(value: boolean): void;
  /** Set initial garrison strength. CWT: Config/effects_new.cwt:887. */
  "set_garrison_strength"(value: number): void;
  /** Set global flag. CWT: Config/effects.cwt:157. */
  "set_global_flag"(value: string): void;
  /** Set global flag. CWT: Config/effects.cwt:160. */
  "set_global_flag"(value: { "flag": string; "value": number; "days"?: number } | CwtNode): void;
  /** Sets the occupation law for an occupied country, occupied state, or the default occupation law of an occupying country. CWT: Config/effects_new.cwt:998. */
  "set_occupation_law"(value: "default_law"): void;
  /** Sets the occupation law for an occupied country, occupied state, or the default occupation law of an occupying country. CWT: Config/effects_new.cwt:1002. */
  "set_occupation_law"(value: string): void;
  /** Sets the occupation law for an occupied country, occupied state, or the default occupation law of an occupying country. What differentiates this effect is that if the law is not available on the given level it will attempt to set it on a level below. I.e. if the law can't be set as the default law i CWT: Config/effects_new.cwt:1006. */
  "set_occupation_law_where_available"(value: "default_law"): void;
  /** Sets the occupation law for an occupied country, occupied state, or the default occupation law of an occupying country. What differentiates this effect is that if the law is not available on the given level it will attempt to set it on a level below. I.e. if the law can't be set as the default law i CWT: Config/effects_new.cwt:1010. */
  "set_occupation_law_where_available"(value: string): void;
  /** Set_province_name = { id = <province id> name = <string> } - Set name for a province. CWT: Config/effects.cwt:2109. */
  "set_province_name"(value: { "id": number; "name": string } | CwtNode): void;
  /** Set resistance of a state. CWT: Config/effects_new.cwt:229. */
  "set_resistance"(value: number): void;
  /** Sets the category of a state. CWT: Config/effects.cwt:2067. */
  "set_state_category"(value: string): void;
  /** transfers state (controls only) to target CWT: Config/effects_nsb.cwt:25. */
  "set_state_controller_to"(value: CountryRef): void;
  /** Set state flag. CWT: Config/effects.cwt:808. */
  "set_state_flag"(value: string): void;
  /** Set state flag. CWT: Config/effects.cwt:811. */
  "set_state_flag"(value: { "flag": string; "value": number; "days"?: number } | CwtNode): void;
  /** Set_state_name = <string> - Set the current states name. CWT: Config/effects.cwt:2116. */
  "set_state_name"(value: string): void;
  /** transfers state (owns) to target, control changes only if at peace with controller and controller doesn't have rule can_occupy_non_war CWT: Config/effects_nsb.cwt:18. */
  "set_state_owner_to"(value: CountryRef): void;
  /** Sets the controller of provinces belong to a state and fulfils a condition. No tooltip is built. CWT: Config/effects_new.cwt:302. */
  "set_state_province_controller"(value: { "controller": CountryRef; "limit"?: CwtNode } | CwtNode): void;
  /** # TEMP VARIABLE Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:53. */
  "set_temp_variable"(value: CwtNode): void;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:88. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:226. */
  "set_temp_variable_to_random"(value: string): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:230. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:3. */
  "set_variable"(value: CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:37. */
  "set_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:168. */
  "set_variable_to_random"(value: string): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:172. */
  "set_variable_to_random"(value: { "var": string; "min"?: number | string; "max"?: number | string; "integer"?: boolean } | CwtNode): void;
  /** Sets victory point to province. CWT: Config/effects_new.cwt:964. */
  "set_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /** Plays sound effect. CWT: Config/effects.cwt:562. */
  "sound_effect"(value: string): void;
  /** Start a border war between two states. CWT: Config/effects.cwt:2450. */
  "start_border_war"(value: { "change_state_after_war": boolean; "combat_width"?: number; "minimum_duration_in_days"?: number; "attacker": { "state": StateRef; "num_provinces": number; "on_win"?: string; "on_lose"?: string; "on_cancel"?: string; "leader_score"?: CwtNode; "dig_in_factor"?: number; "terrain_factor"?: number; "modifier"?: number } | CwtNode; "defender": { "state": StateRef; "num_provinces": number; "on_win"?: string; "on_lose"?: string; "on_cancel"?: string; "modifier"?: number } | CwtNode } | CwtNode): void;
  /** Starts resistance activity for a core country. Use along with force_enable_resistance if you are enabling resistance in a state that is not possible (ie core). CWT: Config/effects_new.cwt:213. */
  "start_resistance"(value: CountryRef): void;
  /** Starts resistance activity for a core country. Use along with force_enable_resistance if you are enabling resistance in a state that is not possible (ie core). CWT: Config/effects_new.cwt:221. */
  "start_resistance"(value: boolean): void;
  /** Fires a state event. CWT: Config/effects.cwt:290. */
  "state_event"(value: { "id": string; "hours"?: number; "days"?: number; "months"?: number; "random_hours"?: number; "random_days"?: number; "random"?: number | CwtNode; "tooltip"?: string; "trigger_for": CountryRef } | CwtNode): void;
  /** Fires a state event. CWT: Config/effects.cwt:339. */
  "state_event"(value: string): void;
  /** Example: strategic_province_location = { natural_harbor = 13071 } Applying the strategic location to a province CWT: Config/effects_ncns.cwt:122. */
  "strategic_province_location"(value: CwtNode): void;
  /** Example: strategic_state_location = { favorable_approach = 12140 } Applying the strategic location to a state (state-wide buildings) CWT: Config/effects_ncns.cwt:131. */
  "strategic_state_location"(value: CwtNode): void;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:133. */
  "subtract_from_temp_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_effects_temp.cwt:140. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:75. */
  "subtract_from_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:79. */
  "subtract_from_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Teleport armies in state to another state or province. CWT: Config/effects_new.cwt:278. */
  "teleport_armies"(value: { "limit"?: CwtNode; "to_state"?: StateRef; "to_state_array"?: string; "to_province"?: number } | CwtNode): void;
  /** transfers state (owns and controls) to target CWT: Config/effects_nsb.cwt:11. */
  "transfer_state_to"(value: CountryRef): void;
  /**  CWT: Config/effects.cwt:1381. */
  "unlock_national_focus"(value: string): void;
  /** Runs the effect as long as a trigger is true. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. CWT: Config/effects.cwt:3200. */
  "while_loop_effect"(value: CwtNode): void;
}
export interface GeneratedStateTriggers {
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1781. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef; "index"?: "int_variable_field_32" } | CwtNode): boolean;
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1800. */
  "add_to_temp_array"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:71. */
  "add_to_temp_variable"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:78. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Checks if the provided trigger is true for all countries that claims the state in scope. `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:526. */
  "all_claimant"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { all_collection_elements = { ``` Example (anonymous collection): Example: *all_collection_elements = { coll CWT: Config/triggers_ncns.cwt:151. */
  "all_collection_elements"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all countries meets the trigger. CWT: Config/triggers.cwt:223. */
  "all_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if all of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:507. */
  "all_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if all country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:195. */
  "all_country_with_original_tag"(value: CwtNode): boolean;
  /** Check if all neighbor states meets the trigger. CWT: Config/triggers.cwt:535. */
  "all_neighbor_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1887. */
  "all_of"(value: CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1918. */
  "all_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all states meets the trigger. CWT: Config/triggers.cwt:525. */
  "all_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Always returns specified value. CWT: Config/triggers.cwt:146. */
  "always"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:41. */
  "AND"(value: CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { any_collection_element = { ``` Example (anonymous collection): Example: *any_collection_element = { collec CWT: Config/triggers_ncns.cwt:124. */
  "any_collection_element"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any country meets the trigger. CWT: Config/triggers.cwt:89. */
  "any_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:533. */
  "any_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any country that has core on the state meets the trigger. CWT: Config/triggers_nsb.cwt:402. */
  "any_country_with_core"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:182. */
  "any_country_with_original_tag"(value: CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:552. */
  "any_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any neighbor state meets the trigger. CWT: Config/triggers.cwt:515. */
  "any_neighbor_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1871. */
  "any_of"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1908. */
  "any_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any other country meets the trigger. Excludes current country. CWT: Config/triggers.cwt:1095. */
  "any_other_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries (except for the current country) fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:571. */
  "any_other_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries and isn't the current country fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:590. */
  "any_other_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** In the current state, checks if any province within the specified limit has a building of the specified level. CWT: Config/triggers.cwt:1369. */
  "any_province_building_level"(value: { "province": { "all_provinces"?: boolean; "limit_to_border"?: boolean; "limit_to_coastal"?: boolean; "limit_to_naval_base"?: boolean; "first"?: boolean } | CwtNode | { "id": number; "limit_to_border"?: boolean; "limit_to_coastal"?: boolean; "limit_to_naval_base"?: boolean } | CwtNode; "building": string; "level": number } | CwtNode): boolean;
  /** Check if any state meets the trigger. CWT: Config/triggers.cwt:505. */
  "any_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /**  CWT: Config/triggers_bba.cwt:68. */
  "any_state_division"(value: Trigger<ScopeByName["unit"]> | CwtNode): boolean;
  /** check if any state in the given category meets the trigger. CWT: Config/triggers_gtd.cwt:84. */
  "any_state_in"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Checks if any of the provided states fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:482. */
  "any_state_of"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Check state's supply area id. CWT: Config/triggers.cwt:138. */
  "area"(value: string): boolean;
  /** Checks if the country (as ROOT) and state in scope can build a building in the state. CWT: Config/triggers_gtd.cwt:198. */
  "can_construct_building"(value: string): boolean;
  /** Evaluates a math expression and returns true when the result is non-zero. CWT: Config/triggers_taog.cwt:57. */
  "check_expr"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:93. */
  "check_variable"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:105. */
  "check_variable"(value: { "var": string | number | boolean | CountryRef | StateRef; "value": string | number | boolean | CountryRef | StateRef; "compare"?: string; "tooltip"?: string } | CwtNode): boolean;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_triggers_temp.cwt:190. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1844. */
  "clear_temp_array"(value: string | CwtOpaque): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1847. */
  "clear_temp_array"(value: number): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:167. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "country": CountryRef } | CwtNode): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:186. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "countries": readonly (CountryRef)[] } | CwtNode): boolean;
  /** - Example: *collection_size = { input = collection:my_awesome_collection value > 1 }* - Variables can be used - Multiple comparisons are allowed: value > x value < y - Supported operators: <, >, = (THIS IS NOT TRUE AS OF 1.17.0.7) - Comparison is inclusive, so "value > X" actually means "value >= X" CWT: Config/triggers_ncns.cwt:396. */
  "collection_size"(value: { "input": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "value": number } | CwtNode): boolean;
  /** Compares the current compliance level of a state to a value. CWT: Config/triggers_new.cwt:50. */
  "compliance"(value: number): boolean;
  /** Compares the current compliance speed of a state to a value. CWT: Config/triggers_new.cwt:54. */
  "compliance_speed"(value: number): boolean;
  /** Returns true if the specified number of sub-triggers return true. CWT: Config/triggers.cwt:1278. */
  "count_triggers"(value: CwtNode): boolean;
  /** Check if the specified country exist. CWT: Config/triggers.cwt:354. */
  "country_exists"(value: CountryRef): boolean;
  /**  CWT: Config/triggers_gtd.cwt:153. */
  "custom_override_tooltip"(value: CwtNode): boolean;
  /** Works as an and-trigger with a custom tooltip. CWT: Config/triggers.cwt:760. */
  "custom_trigger_tooltip"(value: CwtNode): boolean;
  /** Checks for a specific date. CWT: Config/triggers.cwt:619. */
  "date"(value: string): boolean;
  /** Checks the days since last strategic bombing. CWT: Config/triggers.cwt:2054. */
  "days_since_last_strategic_bombing"(value: number): boolean;
  /** Evaluates a math expression and writes the numeric result to the tooltip. CWT: Config/triggers_taog.cwt:31. */
  "debug_math_expr"(value: CwtNode): boolean;
  /** Check if the difficulty is above or below specified value 0-2 (difficulty enum). Example: difficulty > 0 (above easy). CWT: Config/triggers.cwt:46. */
  "difficulty"(value: number): boolean;
  /** Check distance between two states. CWT: Config/triggers.cwt:918. */
  "distance_to"(value: { "value": number; "target": StateRef } | CwtNode): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:104. */
  "divide_temp_variable"(value: CwtNode): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:128. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:28. */
  "else"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:21. */
  "else_if"(value: CwtNode): boolean;
  /** check cost of equipment production line CWT: Config/triggers_gtd.cwt:108. */
  "equipment_cost"(value: CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/triggers.cwt:2006. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/triggers.cwt:1992. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Checks building for available construction levels. CWT: Config/triggers.cwt:699. */
  "free_building_slots"(value: { "building": string; "size": number; "include_locked"?: boolean; "province"?: number } | CwtNode): boolean;
  /** Returns true if all of the active game rule options allow achievements. CWT: Config/triggers.cwt:1758. */
  "game_rules_allow_achievements"(value: true): boolean;
  /** Returns true if state has an active resistance (above zero). CWT: Config/triggers_new.cwt:78. */
  "has_active_resistance"(value: boolean): boolean;
  /** Returns true if the game has any custom difficulty on. CWT: Config/triggers.cwt:1124. */
  "has_any_custom_difficulty_setting"(value: boolean): boolean;
  /** Checks if a there is any border wars for country/state. CWT: Config/triggers.cwt:1582. */
  "has_border_war"(value: boolean): boolean;
  /** Checks if a there is a border war between two states. CWT: Config/triggers.cwt:1590. */
  "has_border_war_between"(value: { "attacker": StateRef; "defender": StateRef } | CwtNode): boolean;
  /** Checks if a there is a border against a state/country. CWT: Config/triggers.cwt:1599. */
  "has_border_war_with"(value: CountryRef): boolean;
  /** Checks if a state has been claimed by target country in an ongoing peace conference. CWT: Config/triggers.cwt:1037. */
  "has_claimed_state_in_peace_conference"(value: CountryRef): boolean;
  /** Checks if a state has the specified country as a contested owner. The trigger can be used either from a country or a state scope and accepts the other as parameter. CWT: Config/triggers_gtd.cwt:179. */
  "has_contested_owner"(value: CountryRef): boolean;
  /** Returns true if the game has the specified custom difficulty on. CWT: Config/triggers.cwt:1120. */
  "has_custom_difficulty_setting"(value: string): boolean;
  /** Checks if player has a DLC. Example: has_dlc = "name of the dlc". CWT: Config/triggers.cwt:176. */
  "has_dlc"(value: string): boolean;
  /** Checks if scope has a dynamic modifier. CWT: Config/triggers.cwt:1959. */
  "has_dynamic_modifier"(value: { "modifier": string; "scope"?: CountryRef | StateRef | string | CwtOpaque } | CwtNode): boolean;
  /** Checks if scope has a dynamic modifier. CWT: Config/triggers.cwt:1988. */
  "has_dynamic_modifier"(value: string): boolean;
  /** Checks if current scope or global scope has the specified event target saved. CWT: Config/triggers.cwt:1570. */
  "has_event_target"(value: string): boolean;
  /** Checks if a game rule is set to a particular option. CWT: Config/triggers.cwt:1751. */
  "has_game_rule"(value: { "rule": string; "option": string } | CwtNode): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:155. */
  "has_global_flag"(value: string): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:160. */
  "has_global_flag"(value: { "flag": string; "value"?: number; "date"?: string; "days"?: number } | CwtNode): boolean;
  /** Compares occupied country that creates resistance to a tag. CWT: Config/triggers_new.cwt:82. */
  "has_occupation_modifier"(value: string): boolean;
  /** Checks if a state contains a railway at or above the specified level. CWT: Config/triggers_nsb.cwt:29. */
  "has_railway_level"(value: { "level": number; "state": StateRef } | CwtNode): boolean;
  /** Returns true if state has a resistance. CWT: Config/triggers_new.cwt:74. */
  "has_resistance"(value: boolean): boolean;
  /** Checks for amount of resources in specified state. CWT: Config/triggers.cwt:1195. */
  "has_resources_amount"(value: { "resource": string; "amount": number; "delivered"?: boolean } | CwtNode): boolean;
  /**  CWT: Config/triggers_nsb.cwt:53. */
  "has_resources_rights"(value: { "receiver": CountryRef; "resources"?: readonly (string)[] } | CwtNode): boolean;
  /** Compare the initial start date of current game. CWT: Config/triggers.cwt:615. */
  "has_start_date"(value: string): boolean;
  /** Check if state has a specific state category. CWT: Config/triggers.cwt:1168. */
  "has_state_category"(value: string): boolean;
  /** Has state flag been setCheck flag val date set and days since set. CWT: Config/triggers.cwt:313. */
  "has_state_flag"(value: string): boolean;
  /** Has state flag been setCheck flag val date set and days since set. CWT: Config/triggers.cwt:318. */
  "has_state_flag"(value: { "flag": string; "value"?: number; "date"?: string; "days"?: number } | CwtNode): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1550. */
  "has_variable"(value: string): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1554. */
  "has_variable"(value: number): boolean;
  /** Trigger not shown in tooltips. CWT: Config/triggers.cwt:2114. */
  "hidden_trigger"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:14. */
  "if"(value: CwtNode): boolean;
  /** Is impassable state CWT: Config/triggers.cwt:2136. */
  "impassable"(value: boolean): boolean;
  /** Checks if a state is in border conflict. CWT: Config/triggers.cwt:714. */
  "is_border_conflict"(value: boolean): boolean;
  /** Checks if a the combatant or leader has a border war. CWT: Config/triggers.cwt:1586. */
  "is_border_war"(value: boolean): boolean;
  /** Is scope state a capital. 169 = { is_capital = yes }. CWT: Config/triggers.cwt:150. */
  "is_capital"(value: boolean): boolean;
  /** Checks if state is claimed by country. CWT: Config/triggers.cwt:651. */
  "is_claimed_by"(value: CountryRef): boolean;
  /** Check if state is coastal. CWT: Config/triggers.cwt:750. */
  "is_coastal"(value: boolean): boolean;
  /** Check if state is controlled by. CWT: Config/triggers.cwt:252. */
  "is_controlled_by"(value: CountryRef): boolean;
  /** Checks if state is core of country. CWT: Config/triggers.cwt:659. */
  "is_core_of"(value: CountryRef): boolean;
  /** Returns true if game is in debug mode (launched with -debug argument). CWT: Config/triggers_new.cwt:86. */
  "is_debug"(value: boolean): boolean;
  /** Checks if a state is a demilitarized zone. CWT: Config/triggers.cwt:710. */
  "is_demilitarized_zone"(value: boolean): boolean;
  /** Checks if scope leader is from an exiled government. is_exiled_leader = yes. CWT: Config/triggers.cwt:1681. */
  "is_exiled_leader"(value: true): boolean;
  /** Checks if scope leader is from specified exiled government. is_exiled_leader_from = FRA. CWT: Config/triggers.cwt:1700. */
  "is_exiled_leader_from"(value: CountryRef): boolean;
  /** Checks if state is fully controlled by specified tag. CWT: Config/triggers.cwt:1538. */
  "is_fully_controlled_by"(value: CountryRef): boolean;
  /** Check if the historical focus is active. CWT: Config/triggers.cwt:992. */
  "is_historical_focus_on"(value: boolean): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1762. */
  "is_in_array"(value: { "array": string | CwtOpaque; "value": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1769. */
  "is_in_array"(value: CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1775. */
  "is_in_array"(value: { "variable_field_32": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Checks if the first province in the state is connected to the capital of its owner. CWT: Config/triggers.cwt:946. */
  "is_in_home_area"(value: boolean): boolean;
  /** Check if current game is ironman. CWT: Config/triggers.cwt:611. */
  "is_ironman"(value: boolean): boolean;
  /** Always returns specified value. CWT: Config/triggers.cwt:1061. */
  "is_island_state"(value: boolean): boolean;
  /** Is state located on continent. CWT: Config/triggers.cwt:831. */
  "is_on_continent"(value: string): boolean;
  /** Is state located on same continent and the capital of right hand side. CWT: Config/triggers.cwt:835. */
  "is_on_continent"(value: CountryRef): boolean;
  /** - Another option is to use the capital state of the tag. *FROM = { is_on_same_continent_as = 111 }* - Can use country scope. Example *GER = { is_on_same_continent_as = ITA }* Checks if the scope state is on the same continent as the given state. CWT: Config/triggers_ncns.cwt:87. */
  "is_on_same_continent_as"(value: CountryRef): boolean;
  /** - Another option is to use the capital state of the tag. *FROM = { is_on_same_continent_as = 111 }* - Can use country scope. Example *GER = { is_on_same_continent_as = ITA }* Checks if the scope state is on the same continent as the given state. CWT: Config/triggers_ncns.cwt:99. */
  "is_on_same_continent_as"(value: StateRef): boolean;
  /** Checks if state is one island CWT: Config/triggers_aat.cwt:4. */
  "is_one_state_island"(value: boolean): boolean;
  /** Check if state is owned by. CWT: Config/triggers.cwt:980. */
  "is_owned_and_controlled_by"(value: CountryRef): boolean;
  /** Check if state is owned by. CWT: Config/triggers.cwt:260. */
  "is_owned_by"(value: CountryRef): boolean;
  /** Check if the tutorial is active. CWT: Config/triggers.cwt:988. */
  "is_tutorial"(value: boolean): boolean;
  /** All inside trigger must be true. At least one entry inside trigger must be true. Negates content of trigger. Print message to game.log - Can be localized. CWT: Config/triggers_new.cwt:15. */
  "log"(value: string): boolean;
  /** Meta triggers can be used for building triggers from strings and running them. following example will test if Germany has 42 pp. CWT: Config/triggers.cwt:1951. */
  "meta_trigger"(value: CwtNode): boolean;
  /** Modulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:161. */
  "modulo_temp_variable"(value: CwtNode): boolean;
  /** Mdulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:167. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:93. */
  "multiply_temp_variable"(value: CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:100. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Check if a state has enough non damaged buildings. CWT: Config/triggers_new.cwt:39. */
  "non_damaged_building_level"(value: { "building": string; "level": number } | CwtNode): boolean;
  /**  CWT: Config/scopes.cwt:34. */
  "NOT"(value: CwtNode): boolean;
  /** Checks if a country owns the amount of states neighbouring the scoped state. CWT: Config/triggers.cwt:1053. */
  "num_claimed_peace_conference_neighbour_states"(value: { "owner": CountryRef; "count": number } | CwtNode): boolean;
  /** Checks if a country owns the amount of states neighbouring the scoped state. CWT: Config/triggers.cwt:1045. */
  "num_owned_neighbour_states"(value: { "owner": CountryRef; "count": number } | CwtNode): boolean;
  /** Checks occupation law of state. CWT: Config/triggers_new.cwt:134. */
  "occupation_law"(value: string): boolean;
  /** Compares occupied country that creates resistance to a tag. CWT: Config/triggers_new.cwt:62. */
  "occupied_country_tag"(value: CountryRef): boolean;
  /**  CWT: Config/scopes.cwt:42. */
  "OR"(value: CwtNode): boolean;
  /** Checks if the current scope was demilitarised during a current or previously-ended peace conference. CWT: Config/triggers_bba.cwt:147. */
  "pc_does_state_stack_demilitarized"(value: boolean): boolean;
  /** Checks if the current scope was dismantled during a current or previously-ended peace conference. CWT: Config/triggers_bba.cwt:151. */
  "pc_does_state_stack_dismantled"(value: boolean): boolean;
  /** Checks if the current scope was claimed by any country during the peace conference. CWT: Config/triggers_bba.cwt:157. */
  "pc_is_state_claimed"(value: boolean): boolean;
  /** Check if state is claimed with a take_states action in conference for TAG. Example: pc_is_state_claimed_and_taken_by = SOV/ROOT/ROOT.FROM" CWT: Config/common/peace_conference.cwt:210. */
  "pc_is_state_claimed_and_taken_by"(value: CountryRef): boolean;
  /** Checks if the current scope was claimed by the specified country during the peace conference. CWT: Config/triggers_bba.cwt:161. */
  "pc_is_state_claimed_by"(value: CountryRef): boolean;
  /** Checks if the current scope was claimed by the specified country during the peace conference. CWT: Config/triggers_bba.cwt:164. */
  "pc_is_state_outside_influence_for_winner"(value: CountryRef): boolean;
  /** Compares the amount of turns that have passed during the peace conference with a number. CWT: Config/triggers_bba.cwt:175. */
  "pc_turn"(value: number): boolean;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/triggers.cwt:1635. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:143. */
  "randomize_temp_variable"(value: string): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:147. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): boolean;
  /** Check state's strategic area id. CWT: Config/triggers.cwt:130. */
  "region"(value: string): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1811. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1824. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1833. */
  "remove_from_temp_array"(value: CwtNode): boolean;
  /** Check amount of reserves. CWT: Config/triggers.cwt:76. */
  "reserves"(value: number): boolean;
  /** Compares the current resistance level of a state to a value. CWT: Config/triggers_new.cwt:23. */
  "resistance"(value: number): boolean;
  /** Compares the current resistance speed of a state to a value. CWT: Config/triggers_new.cwt:58. */
  "resistance_speed"(value: number): boolean;
  /** Compares the target resistance level of a state to a value. CWT: Config/triggers_new.cwt:70. */
  "resistance_target"(value: number): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1851. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1863. */
  "resize_temp_array"(value: CwtNode): boolean;
  /** Rounds a temporary variable. CWT: Config/variable_triggers_temp.cwt:200. */
  "round_temp_variable"(value: string): boolean;
  /** Check if the current scope exist. CWT: Config/triggers_gtd.cwt:104. */
  "scope_exists"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:1. */
  "scope_field"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:3. */
  "set_temp_variable"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:38. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:174. */
  "set_temp_variable_to_random"(value: string): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:178. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): boolean;
  /** Check state id. CWT: Config/triggers.cwt:6. */
  "state"(value: StateRef): boolean;
  /** Checks for state strategic value. CWT: Config/triggers.cwt:1739. */
  "state_and_terrain_strategic_value"(value: number): boolean;
  /** Check the population in the state. CWT: Config/triggers.cwt:950. */
  "state_population"(value: number): boolean;
  /** Check the population in the state. CWT: Config/triggers.cwt:954. */
  "state_population"(value: string): boolean;
  /** Check the population in the state in thousands (use to avoid variable overflows). CWT: Config/triggers.cwt:1939. */
  "state_population_k"(value: number): boolean;
  /** Check the population in the state in thousands (use to avoid variable overflows). CWT: Config/triggers.cwt:1943. */
  "state_population_k"(value: string): boolean;
  /** Checks for state strategic value. CWT: Config/triggers.cwt:1735. */
  "state_strategic_value"(value: number): boolean;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:82. */
  "subtract_from_temp_variable"(value: CwtNode): boolean;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_triggers_temp.cwt:89. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Check the global threat value. 0-1 value. CWT: Config/triggers.cwt:142. */
  "threat"(value: number): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:706. */
  "tooltip_evaluation"(value: "eval"): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:733. */
  "tooltip_evaluation"(value: "no_eval"): boolean;
}
export interface GeneratedCharacterEffects {
  /**  CWT: Config/effects_nsb.cwt:298. */
  "add_advisor_role"(value: { "character"?: string | CwtOpaque; "activate"?: boolean; "advisor": { "slot": string; "idea_token"?: string; "name"?: string; "desc"?: string; "traits": readonly (string)[]; "research_bonus"?: CwtNode; "ledger"?: string; "cost"?: number; "removal_cost"?: number; "ai_will_do"?: CwtNode; "modifier"?: CwtNode; "can_be_fired"?: boolean } | CwtNode } | CwtNode): void;
  /** Adds attack skill to a unit leader. CWT: Config/effects.cwt:2371. */
  "add_attack"(value: number): void;
  /** Adds maneuver skill to a unit leader. CWT: Config/effects.cwt:2767. */
  "add_coordination"(value: number): void;
  /**  CWT: Config/effects_nsb.cwt:65. */
  "add_corps_commander_role"(value: { "character"?: string | CwtOpaque; "desc"?: string; "traits"?: readonly (string)[]; "skill"?: number; "attack_skill"?: number; "defense_skill"?: number; "planning_skill"?: number; "logistics_skill"?: number; "female"?: boolean; "legacy_id"?: string; "visible"?: CwtNode } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:234. */
  "add_country_leader_role"(value: { "character"?: string | CwtOpaque; "promote_leader"?: boolean; "country_leader": { "desc"?: string; "ideology": string; "traits"?: readonly (string)[]; "expire"?: string; "id"?: number } | CwtNode } | CwtNode): void;
  /** Adds defense skill to a unit leader. CWT: Config/effects.cwt:2375. */
  "add_defense"(value: number): void;
  /** Add divisional commander xp to unit CWT: Config/effects_new.cwt:1018. */
  "add_divisional_commander_xp"(value: number): void;
  /** Adds a dynamic modifier to country/state/unit leader. CWT: Config/effects.cwt:3137. */
  "add_dynamic_modifier"(value: { "modifier": string; "scope"?: CountryRef | StateRef | string | CwtOpaque; "days"?: number } | CwtNode): void;
  /** Adds the specified equipment bonuses to the country. As description the given loc key or the name of given special project will be used. Same usage as in Ideas/National spirits CWT: Config/effects_gtd.cwt:120. */
  "add_equipment_bonus"(value: { "name"?: string; "project"?: CwtOpaque; "bonus": CwtNode } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:153. */
  "add_field_marshal_role"(value: { "character"?: string | CwtOpaque; "desc"?: string; "traits"?: readonly (string)[]; "skill": number; "attack_skill": number; "defense_skill": number; "planning_skill": number; "logistics_skill": number; "legacy_id"?: string; "visible"?: CwtNode } | CwtNode): void;
  /** Adds logistics skill to a unit leader. CWT: Config/effects.cwt:2419. */
  "add_logistics"(value: number): void;
  /** Adds maneuver skill to a unit leader. CWT: Config/effects.cwt:2763. */
  "add_maneuver"(value: number): void;
  /** Adds a max assignable trait slot for a general. CWT: Config/effects.cwt:2435. */
  "add_max_trait"(value: number): void;
  /** Adds new namespace. CWT: Config/effects.cwt:761. */
  "add_namespace"(value: string | number | boolean | CountryRef | StateRef): void;
  /**  CWT: Config/effects_nsb.cwt:194. */
  "add_naval_commander_role"(value: { "character"?: string | CwtOpaque; "desc"?: string; "traits"?: readonly (string)[]; "skill": number; "attack_skill": number; "defense_skill": number; "maneuvering_skill": number; "coordination_skill": number; "legacy_id"?: string; "visible"?: CwtNode } | CwtNode): void;
  /** Adds planning skill to a unit leader. CWT: Config/effects.cwt:2379. */
  "add_planning"(value: number): void;
  /** Add random trait from specified list to unit leader. add_random_trait = { old_guard brilliant_strategist inflexible_strategist }. CWT: Config/effects.cwt:2735. */
  "add_random_trait"(value: readonly (string)[]): void;
  /** Add efficiency factor to strategic region for from country. CWT: Config/effects.cwt:2342. */
  "add_region_efficiency"(value: "replace_me"): void;
  /** Add levels to a special project specialization for a scientist character in scope. CWT: Config/effects_gtd.cwt:33. */
  "add_scientist_level"(value: { "level": number; "specialization": string } | CwtNode): void;
  /** Add scientist role to a character. The character can come from the scope or from an input parameter. The scientist role format is the same as in the character DB. Except the visible trigger - a scientist role created via effect cannot have triggers. CWT: Config/effects_gtd.cwt:235. */
  "add_scientist_role"(value: { "scientist": { "desc"?: string; "traits"?: readonly (string)[]; "skills": CwtNode } | CwtNode } | CwtNode): void;
  /** Add a trait to a scientist character in scope. CWT: Config/effects_gtd.cwt:48. */
  "add_scientist_trait"(value: string): void;
  /** Add experience to a special project specialization for a scientist character in scope. CWT: Config/effects_gtd.cwt:40. */
  "add_scientist_xp"(value: { "experience": number | string; "specialization": string } | CwtNode): void;
  /** Adds a skill level to a unit leader. CWT: Config/effects.cwt:2439. */
  "add_skill_level"(value: number): void;
  /** Adds either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:154. */
  "add_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /** Add a timed trait to unit leader. CWT: Config/effects.cwt:2443. */
  "add_timed_unit_leader_trait"(value: { "trait": string; "days": number } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2824. */
  "add_to_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2846. */
  "add_to_array"(value: CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2943. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2965. */
  "add_to_temp_array"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:122. */
  "add_to_temp_variable"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:129. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:67. */
  "add_to_variable"(value: CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:71. */
  "add_to_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** makes character head of their ideology party CWT: Config/effects_nsb.cwt:510. */
  "add_trait"(value: { "character"?: string | CwtOpaque; "trait": string; "ideology"?: string; "slot"?: string } | CwtNode): void;
  /** Add trait to unit leader. CWT: Config/effects.cwt:757. */
  "add_unit_leader_trait"(value: string): void;
  /** Adds victory point to province. CWT: Config/effects_new.cwt:957. */
  "add_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:51. */
  "AND"(value: CwtNode): void;
  /** Boost planning of units that are belongs to the army group/navy of this unit leader. CWT: Config/effects.cwt:2338. */
  "boost_planning"(value: number): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1372. */
  "break"(value: "none"): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1376. */
  "break"(value: true): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:844. */
  "build_railway"(value: { "path": readonly (number)[]; "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:878. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_province": number; "target_province": number; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:915. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_state": StateRef; "target_state": StateRef; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Make the Unit Leader in scope be captured by the specified country (needs to be a general). Optionally specify the province where the leader is held captive. CWT: Config/effects_taog.cwt:33. */
  "capture_by"(value: CountryRef): void;
  /** Make the Unit Leader in scope be captured by the specified country (needs to be a general). Optionally specify the province where the leader is held captive. CWT: Config/effects_taog.cwt:41. */
  "capture_by"(value: { "target": CountryRef; "province": number } | CwtNode): void;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_effects_temp.cwt:242. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): void;
  /** Clamps a variable between two a values or another variables. CWT: Config/variable_effects.cwt:188. */
  "clamp_variable"(value: { "var": CwtOpaque; "min"?: number | string; "max"?: number | string } | CwtNode): void;
  /** Clears the contents of array. CWT: Config/effects.cwt:2907. */
  "clear_array"(value: string | CwtOpaque): void;
  /** Clear a global event target. CWT: Config/effects.cwt:1364. */
  "clear_global_event_target"(value: string): void;
  /** Clear all global event targets. CWT: Config/effects.cwt:1368. */
  "clear_global_event_targets"(value: true): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3016. */
  "clear_temp_array"(value: string): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3019. */
  "clear_temp_array"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:206. */
  "clear_variable"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:210. */
  "clear_variable"(value: CwtOpaque): void;
  /**  CWT: Config/effects_nsb.cwt:498. */
  "clr_character_flag"(value: string): void;
  /** Clear global flag. CWT: Config/effects.cwt:170. */
  "clr_global_flag"(value: string): void;
  /** Clear unit leader flag. CWT: Config/effects.cwt:2307. */
  "clr_unit_leader_flag"(value: string): void;
  /** Creates a dynamic country and runs child effects on it. CWT: Config/effects_new.cwt:327. */
  "create_dynamic_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Creates an enitity Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. For comparison, default minimum zoom level (closest to the map) is 50 units, while default maximum CWT: Config/effects_nsb.cwt:823. */
  "create_entity"(value: { "entity": string; "id"?: string; "var"?: string; "x"?: number; "y"?: number; "z"?: number; "province"?: number; "state"?: StateRef; "rotation": number; "scale": number; "min_zoom": number; "visible"?: string } | CwtNode): void;
  /** Creates a purchase contract between the countries CWT: Config/effects_aat.cwt:253. */
  "create_purchase_contract"(value: { "seller": CountryRef; "buyer": CountryRef; "civilian_factories": number; "equipment": { "type": string; "amount": number } | CwtNode } | CwtNode): void;
  /** Create railway gun effect CWT: Config/effects_nsb.cwt:713. */
  "create_railway_gun"(value: { "equipment": string; "name"?: string; "location"?: number } | CwtNode): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:14. */
  "custom_effect_tooltip"(value: string): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:17. */
  "custom_effect_tooltip"(value: CwtNode): void;
  /** Executes the provided effects but with a custom tooltip surpressing all tooltips from all other effects inside this block. The custom tooltip is a [bindable localization] CWT: Config/effects_gtd.cwt:318. */
  "custom_override_tooltip"(value: CwtNode): void;
  /** Demotes field marshal to general. CWT: Config/effects.cwt:2311. */
  "demote_leader"(value: true): void;
  /** Destroys an existing entity IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:849. */
  "destroy_entity"(value: string): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:155. */
  "divide_temp_variable"(value: CwtNode): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:179. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:91. */
  "divide_variable"(value: CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:116. */
  "divide_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Shows just tooltip of effects. CWT: Config/effects.cwt:1510. */
  "effect_tooltip"(value: CwtNode): void;
  /** Use after (else_)if for a catch-all case. CWT: Config/effects.cwt:431. */
  "else"(value: CwtNode): void;
  /** Use after (else_)if to check other triggers only if first if fails. CWT: Config/effects.cwt:422. */
  "else_if"(value: CwtNode): void;
  /** Shows event option tooltip CWT: Config/effects.cwt:27. */
  "event_option_tooltip"(value: string): void;
  /** - Example *every_collection_element = { limit = { xxx } add_political_power = 1 } - Some collections, like 'country:faction_members', require country scope - Supports 'limit' trigger Applies arbitrary effects to all elements of a collection. Supports both anonymous and regular collections CWT: Config/effects_ncns.cwt:248. */
  "every_collection_element"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfills the "limit" trigger. CWT: Config/effects.cwt:205. */
  "every_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a all countries with original tag. tooltip=key can be defined to override tooltip title. CWT: Config/effects_new.cwt:445. */
  "every_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfils the "limit" trigger. Difference with every_country is that it includes countries not yet present on the map. tooltip=key can be defined to override tooltip title. CWT: Config/effects_nsb.cwt:599. */
  "every_possible_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1067. */
  "every_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/effects.cwt:3261. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/effects.cwt:3247. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array. CWT: Config/effects.cwt:3042. */
  "for_each_loop"(value: CwtNode): void;
  /** Runs a loop on for each element of an array and changes scope to current element in each iteration. CWT: Config/effects.cwt:3068. */
  "for_each_scope_loop"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Runs a same effects through a loop. example will run the effects for value_name = -3, 0, 3, 6, 9 and then terminate. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. Consider using for_each_loop instead. CWT: Config/effects.cwt:3175. */
  "for_loop_effect"(value: CwtNode): void;
  /** Updates the modifiers in current scope (use if you don't want to wait for daily update to update them). CWT: Config/effects.cwt:3099. */
  "force_update_dynamic_modifier"(value: true): void;
  /** Executes children effects on army leaders for every country in the world that fulfills the "limit" trigger. Better to use every_army_leader if you know the country. CWT: Config/effects.cwt:2355. */
  "global_every_army_leader"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Goes to stated province. CWT: Config/effects.cwt:1690. */
  "goto_province"(value: number): void;
  /** Goes to stated state. CWT: Config/effects.cwt:1694. */
  "goto_state"(value: StateRef): void;
  /** Effect not shown in tooltips. CWT: Config/effects.cwt:3783. */
  "hidden_effect"(value: CwtNode): void;
  /** A conditional effect. CWT: Config/effects.cwt:413. */
  "if"(value: CwtNode): void;
  /** Injure a scientist for x amount of days to a scientist character in scope. CWT: Config/effects_gtd.cwt:86. */
  "injure_scientist_for_days"(value: number): void;
  /** Print message to game.log - Can be localized. CWT: Config/effects.cwt:493. */
  "log"(value: string): void;
  /** Meta effects can be used for building effects from strings and running them. following example will give Germany 42 pp. CWT: Config/effects.cwt:3214. */
  "meta_effect"(value: CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:493. */
  "modify_character_flag"(value: { "flag": string; "value": number } | CwtNode): void;
  /** Modify global flag. Only modifies if flag already exists. CWT: Config/effects.cwt:2071. */
  "modify_global_flag"(value: { "flag": string; "value"?: number; "days"?: number } | CwtNode): void;
  /** Modify unit leader flag. Only modifies if flag already exists. CWT: Config/effects.cwt:2297. */
  "modify_unit_leader_flag"(value: { "flag": string; "value"?: number; "days"?: number } | CwtNode): void;
  /** Modulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:213. */
  "modulo_temp_variable"(value: CwtNode): void;
  /** Mdulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:219. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:155. */
  "modulo_variable"(value: CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:161. */
  "modulo_variable"(value: { "var": CwtOpaque; "value": number } | CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:144. */
  "multiply_temp_variable"(value: CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:151. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:83. */
  "multiply_variable"(value: CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:87. */
  "multiply_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:44. */
  "NOT"(value: CwtNode): void;
  /**  CWT: Config/scopes.cwt:52. */
  "OR"(value: CwtNode): void;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/effects.cwt:2572. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): void;
  /** makes character head of their ideology party CWT: Config/effects_nsb.cwt:458. */
  "promote_character"(value: boolean): void;
  /** makes character head of their ideology party CWT: Config/effects_nsb.cwt:461. */
  "promote_character"(value: string): void;
  /** makes character head of their ideology party CWT: Config/effects_nsb.cwt:467. */
  "promote_character"(value: { "ideology": string } | CwtNode): void;
  /** Promotes general to field marshal. CWT: Config/effects.cwt:566. */
  "promote_leader"(value: boolean): void;
  /** Promote the officer of the division to a general scope = unit CWT: Config/effects_gtd.cwt:298. */
  "promote_officer_to_general"(value: boolean): void;
  /** A possible random effect that can occur. CWT: Config/effects.cwt:343. */
  "random"(value: CwtNode): void;
  /** Executes children effects on random country that fulfills the "limit" trigger. CWT: Config/effects.cwt:211. */
  "random_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a random country with original tag. CWT: Config/effects_new.cwt:420. */
  "random_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** A list of possible random effects to trigger in this effect. CWT: Config/effects.cwt:355. */
  "random_list"(value: CwtNode): void;
  /** Runs the effect for a random element in array. CWT: Config/effects.cwt:3082. */
  "random_scope_in_array"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on random state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1049. */
  "random_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:194. */
  "randomize_temp_variable"(value: string): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:198. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:132. */
  "randomize_variable"(value: string): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:136. */
  "randomize_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number | string; "max"?: number | string; "lambda"?: number } | CwtNode): void;
  /** Randomize weather effect. CWT: Config/effects.cwt:570. */
  "randomize_weather"(value: number): void;
  /** Releases the scoped army leader from captivity. Has no effect if the leader is not captured. CWT: Config/effects_taog.cwt:3. */
  "release_from_captivity"(value: boolean): void;
  /**  CWT: Config/effects_nsb.cwt:366. */
  "remove_advisor_role"(value: { "character"?: string | CwtOpaque; "slot": string } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:273. */
  "remove_country_leader_role"(value: { "character"?: string | CwtOpaque; "ideology"?: string } | CwtNode): void;
  /** Removes a dynamic modifier from country/state/unit leader. CWT: Config/effects.cwt:3103. */
  "remove_dynamic_modifier"(value: { "modifier": string; "scope"?: CountryRef | StateRef | string | CwtOpaque } | CwtNode): void;
  /** Remove exile tag from scope unit leader. remove_exile_tag = yes. CWT: Config/effects.cwt:2742. */
  "remove_exile_tag"(value: true): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2869. */
  "remove_from_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2884. */
  "remove_from_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2894. */
  "remove_from_array"(value: CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2978. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2993. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:3003. */
  "remove_from_temp_array"(value: CwtNode): void;
  /** Remove the scientist role from a character.The character can come from the scope or from an input parameter. The scientist role format is the same as in the character DB. Except the visible trigger - a scientist role created via effect cannot have triggers. CWT: Config/effects_gtd.cwt:254. */
  "remove_scientist_role"(value: boolean): void;
  /** Removes either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:164. */
  "remove_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:534. */
  "remove_trait"(value: { "character"?: string | CwtOpaque; "trait": string; "ideology"?: string; "slot"?: string } | CwtNode): void;
  /** Remove unit leader role to character CWT: Config/effects_nsb.cwt:118. */
  "remove_unit_leader_role"(value: boolean): void;
  /**  CWT: Config/effects_nsb.cwt:123. */
  "remove_unit_leader_role"(value: string): void;
  /** Remove trait from unit leader. CWT: Config/effects.cwt:753. */
  "remove_unit_leader_trait"(value: string): void;
  /** Add trait to unit leader. CWT: Config/effects.cwt:2431. */
  "replace_unit_leader_trait"(value: "replace_me"): void;
  /** Reset name of a province back to localization one. CWT: Config/effects.cwt:2120. */
  "reset_province_name"(value: number): void;
  /** Resizes array. CWT: Config/effects.cwt:2911. */
  "resize_array"(value: { "array": string; "value"?: number | string; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes array. CWT: Config/effects.cwt:2928. */
  "resize_array"(value: CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3023. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3035. */
  "resize_temp_array"(value: CwtNode): void;
  /** Retires scope unit leader. CWT: Config/effects.cwt:2315. */
  "retire"(value: boolean): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:397. */
  "retire_character"(value: string): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:409. */
  "retire_character"(value: CwtOpaque): void;
  /** Rounds a temporary variable. CWT: Config/variable_effects_temp.cwt:252. */
  "round_temp_variable"(value: string): void;
  /** Rounds a variable. CWT: Config/variable_effects.cwt:202. */
  "round_variable"(value: CwtOpaque): void;
  /** Save an event target. CWT: Config/effects.cwt:1356. */
  "save_event_target_as"(value: string): void;
  /** Save a global event target. CWT: Config/effects.cwt:1360. */
  "save_global_event_target_as"(value: string): void;
  /**  CWT: Config/scopes.cwt:32. */
  "scope_field"(value: CwtNode): void;
  /**  CWT: Config/effects_bba.cwt:92. */
  "set_can_be_fired_in_advisor_role"(value: { "character"?: string | CwtOpaque; "slot"?: string; "value": boolean } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:482. */
  "set_character_flag"(value: string): void;
  /**  CWT: Config/effects_nsb.cwt:485. */
  "set_character_flag"(value: { "flag": string; "value": number; "days"?: number } | CwtNode): void;
  /** renames character CWT: Config/effects_nsb.cwt:413. */
  "set_character_name"(value: string): void;
  /** renames character CWT: Config/effects_nsb.cwt:419. */
  "set_character_name"(value: { "character"?: string | CwtOpaque; "name": string } | CwtNode): void;
  /** Sets the animation of a specified entity IDs are set by the create_entity effect. Animations are defined within the /Hearts of Iron IV/gfx/models/** /*.asset files. CWT: Config/effects_nsb.cwt:903. */
  "set_entity_animation"(value: { "id": string; "animation": string } | CwtNode): void;
  /** Sets the position and rotation of an entity using two coordinates. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:855. */
  "set_entity_movement"(value: { "id": string; "start": { "x": number; "y": number; "z"?: number } | CwtNode; "target": { "province": number } | CwtNode; "ratio": number; "rotation": number } | CwtNode): void;
  /** Sets the position of an existing entity. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. CWT: Config/effects_nsb.cwt:873. */
  "set_entity_position"(value: { "id": string; "x": number; "y": number; "z"?: number; "province": "enum"; "state": StateRef } | CwtNode): void;
  /** Sets the currently-facing angle of an existing entity. IDs are set by the create_entity effect. A positive change results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:887. */
  "set_entity_rotation"(value: { "id": string; "rotation": number } | CwtNode): void;
  /** Sets the size of an existing entity. IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:895. */
  "set_entity_scale"(value: { "id": string; "scale": number } | CwtNode): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:269. */
  "set_faction_military_unlocked"(value: boolean): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:265. */
  "set_faction_research_unlocked"(value: boolean): void;
  /** Set global flag. CWT: Config/effects.cwt:157. */
  "set_global_flag"(value: string): void;
  /** Set global flag. CWT: Config/effects.cwt:160. */
  "set_global_flag"(value: { "flag": string; "value": number; "days"?: number } | CwtNode): void;
  /** Changes the description of unit leader. No tooltip is generated. CWT: Config/effects_new.cwt:953. */
  "set_leader_description"(value: string): void;
  /** Changes the name of unit leader. No tooltip is generated. CWT: Config/effects_new.cwt:945. */
  "set_leader_name"(value: string): void;
  /** Changes the portrait of unit leader. No tooltip is generated. CWT: Config/effects_new.cwt:949. */
  "set_leader_portrait"(value: string): void;
  /** Transfer from one country to another for the character in scope. Note that this is not related to operative nationalities added via add_nationality. Note that for operative, this will temporarily lock their slot on the country of origin CWT: Config/effects_nsb.cwt:559. */
  "set_nationality"(value: { "target_country": CountryRef; "character": string | CwtOpaque } | CwtNode): void;
  /** Transfer from one country to another for the character in scope. Note that this is not related to operative nationalities added via add_nationality. Note that for operative, this will temporarily lock their slot on the country of origin CWT: Config/effects_nsb.cwt:572. */
  "set_nationality"(value: CountryRef): void;
  /** Transfer from one country to another for the character in scope. Note that this is not related to operative nationalities added via add_nationality. Note that for operative, this will temporarily lock their slot on the country of origin CWT: Config/effects_nsb.cwt:576. */
  "set_nationality"(value: { "target_country": CountryRef } | CwtNode): void;
  /** set portraits for the target character. Syntax is similar to character files. CWT: Config/effects_nsb.cwt:613. */
  "set_portraits"(value: CwtNode): void;
  /** Set_province_name = { id = <province id> name = <string> } - Set name for a province. CWT: Config/effects.cwt:2109. */
  "set_province_name"(value: { "id": number; "name": string } | CwtNode): void;
  /** # TEMP VARIABLE Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:53. */
  "set_temp_variable"(value: CwtNode): void;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:88. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:226. */
  "set_temp_variable_to_random"(value: string): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:230. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): void;
  /** Set unit leader flag. CWT: Config/effects.cwt:2285. */
  "set_unit_leader_flag"(value: string): void;
  /** Set unit leader flag. CWT: Config/effects.cwt:2288. */
  "set_unit_leader_flag"(value: { "flag": string; "value": number; "days"?: number } | CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:3. */
  "set_variable"(value: CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:37. */
  "set_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:168. */
  "set_variable_to_random"(value: string): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:172. */
  "set_variable_to_random"(value: { "var": string; "min"?: number | string; "max"?: number | string; "integer"?: boolean } | CwtNode): void;
  /** Sets victory point to province. CWT: Config/effects_new.cwt:964. */
  "set_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /** Plays sound effect. CWT: Config/effects.cwt:562. */
  "sound_effect"(value: string): void;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:133. */
  "subtract_from_temp_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_effects_temp.cwt:140. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:75. */
  "subtract_from_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:79. */
  "subtract_from_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Give supply to units being controlled by this leader. CWT: Config/effects.cwt:3291. */
  "supply_units"(value: number): void;
  /**  CWT: Config/effects_nsb.cwt:473. */
  "swap_country_leader_traits"(value: { "remove": string; "add": string; "ideology"?: string } | CwtNode): void;
  /** Fires a unit leader event for owner country. CWT: Config/effects.cwt:2661. */
  "unit_leader_event"(value: { "id": string; "hours"?: number; "days"?: number; "months"?: number; "random_hours"?: number; "random_days"?: number; "random"?: number | CwtNode; "tooltip"?: string } | CwtNode): void;
  /** Fires a unit leader event for owner country. CWT: Config/effects.cwt:2707. */
  "unit_leader_event"(value: string): void;
  /**  CWT: Config/effects.cwt:1381. */
  "unlock_national_focus"(value: string): void;
  /** Runs the effect as long as a trigger is true. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. CWT: Config/effects.cwt:3200. */
  "while_loop_effect"(value: CwtNode): void;
}
export interface GeneratedCharacterTriggers {
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1781. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef; "index"?: "int_variable_field_32" } | CwtNode): boolean;
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1800. */
  "add_to_temp_array"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:71. */
  "add_to_temp_variable"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:78. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Return true if the character has an advisor role and they can be fired. Warning: will return false if the character has no advisor role or it does not match the input slot. You should use has_advisor_role trigger first to really test the can_be_fired flag CWT: Config/triggers_nsb.cwt:410. */
  "advisor_can_be_fired"(value: boolean): boolean;
  /** Return true if the character has an advisor role and they can be fired. Warning: will return false if the character has no advisor role or it does not match the input slot. You should use has_advisor_role trigger first to really test the can_be_fired flag CWT: Config/triggers_nsb.cwt:414. */
  "advisor_can_be_fired"(value: { "slot": string } | CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { all_collection_elements = { ``` Example (anonymous collection): Example: *all_collection_elements = { coll CWT: Config/triggers_ncns.cwt:151. */
  "all_collection_elements"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all countries meets the trigger. CWT: Config/triggers.cwt:223. */
  "all_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if all of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:507. */
  "all_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if all country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:195. */
  "all_country_with_original_tag"(value: CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1887. */
  "all_of"(value: CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1918. */
  "all_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all states meets the trigger. CWT: Config/triggers.cwt:525. */
  "all_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Always returns specified value. CWT: Config/triggers.cwt:146. */
  "always"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:41. */
  "AND"(value: CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { any_collection_element = { ``` Example (anonymous collection): Example: *any_collection_element = { collec CWT: Config/triggers_ncns.cwt:124. */
  "any_collection_element"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any country meets the trigger. CWT: Config/triggers.cwt:89. */
  "any_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:533. */
  "any_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:182. */
  "any_country_with_original_tag"(value: CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:552. */
  "any_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1871. */
  "any_of"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1908. */
  "any_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any other country meets the trigger. Excludes current country. CWT: Config/triggers.cwt:1095. */
  "any_other_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries (except for the current country) fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:571. */
  "any_other_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries and isn't the current country fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:590. */
  "any_other_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any state meets the trigger. CWT: Config/triggers.cwt:505. */
  "any_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** check if any state in the given category meets the trigger. CWT: Config/triggers_gtd.cwt:84. */
  "any_state_in"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Checks if any of the provided states fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:482. */
  "any_state_of"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Compares attack skill level of a unit leader. CWT: Config/triggers.cwt:1611. */
  "attack_skill_level"(value: number): boolean;
  /** Compares the average stats for a unit leader. CWT: Config/triggers.cwt:1607. */
  "average_stats"(value: number): boolean;
  /** Checks if the current character can be captured while deployed in a division CWT: Config/triggers_taog.cwt:3. */
  "can_be_captured"(value: boolean): boolean;
  /** Can the character be a country leader. CWT: Config/triggers_nsb.cwt:198. */
  "can_be_country_leader"(value: boolean): boolean;
  /** Has character flag been set. Check flag val date set and days since set. CWT: Config/triggers_nsb.cwt:275. */
  "character_flag"(value: { "flag": string; "value"?: number; "date"?: string; "days"?: number } | CwtNode): boolean;
  /** Evaluates a math expression and returns true when the result is non-zero. CWT: Config/triggers_taog.cwt:57. */
  "check_expr"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:93. */
  "check_variable"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:105. */
  "check_variable"(value: { "var": string | number | boolean | CountryRef | StateRef; "value": string | number | boolean | CountryRef | StateRef; "compare"?: string; "tooltip"?: string } | CwtNode): boolean;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_triggers_temp.cwt:190. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1844. */
  "clear_temp_array"(value: string | CwtOpaque): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1847. */
  "clear_temp_array"(value: number): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:167. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "country": CountryRef } | CwtNode): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:186. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "countries": readonly (CountryRef)[] } | CwtNode): boolean;
  /** - Example: *collection_size = { input = collection:my_awesome_collection value > 1 }* - Variables can be used - Multiple comparisons are allowed: value > x value < y - Supported operators: <, >, = (THIS IS NOT TRUE AS OF 1.17.0.7) - Comparison is inclusive, so "value > X" actually means "value >= X" CWT: Config/triggers_ncns.cwt:396. */
  "collection_size"(value: { "input": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "value": number } | CwtNode): boolean;
  /** Returns true if the specified number of sub-triggers return true. CWT: Config/triggers.cwt:1278. */
  "count_triggers"(value: CwtNode): boolean;
  /** Check if the specified country exist. CWT: Config/triggers.cwt:354. */
  "country_exists"(value: CountryRef): boolean;
  /**  CWT: Config/triggers_gtd.cwt:153. */
  "custom_override_tooltip"(value: CwtNode): boolean;
  /** Works as an and-trigger with a custom tooltip. CWT: Config/triggers.cwt:760. */
  "custom_trigger_tooltip"(value: CwtNode): boolean;
  /** Checks for a specific date. CWT: Config/triggers.cwt:619. */
  "date"(value: string): boolean;
  /** Evaluates a math expression and writes the numeric result to the tooltip. CWT: Config/triggers_taog.cwt:31. */
  "debug_math_expr"(value: CwtNode): boolean;
  /** Compares defense skill level of a unit leader. CWT: Config/triggers.cwt:1615. */
  "defense_skill_level"(value: number): boolean;
  /** Check if the difficulty is above or below specified value 0-2 (difficulty enum). Example: difficulty > 0 (above easy). CWT: Config/triggers.cwt:46. */
  "difficulty"(value: number): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:104. */
  "divide_temp_variable"(value: CwtNode): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:128. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:28. */
  "else"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:21. */
  "else_if"(value: CwtNode): boolean;
  /** check cost of equipment production line CWT: Config/triggers_gtd.cwt:108. */
  "equipment_cost"(value: CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/triggers.cwt:2006. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/triggers.cwt:1992. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Returns true if all of the active game rule options allow achievements. CWT: Config/triggers.cwt:1758. */
  "game_rules_allow_achievements"(value: true): boolean;
  /** Check if character has specific advisor role CWT: Config/triggers_nsb.cwt:406. */
  "has_advisor_role"(value: string): boolean;
  /** Checks if the current character has an air ledger. CWT: Config/triggers_nsb.cwt:262. */
  "has_air_ledger"(value: boolean): boolean;
  /** Returns true if the game has any custom difficulty on. CWT: Config/triggers.cwt:1124. */
  "has_any_custom_difficulty_setting"(value: boolean): boolean;
  /** Checks if the current character has an army ledger. CWT: Config/triggers_nsb.cwt:254. */
  "has_army_ledger"(value: boolean): boolean;
  /** Has character flag been set. Check flag val date set and days since set. CWT: Config/triggers_nsb.cwt:79. */
  "has_character_flag"(value: string): boolean;
  /** Has character flag been set. Check flag val date set and days since set. CWT: Config/triggers_nsb.cwt:84. */
  "has_character_flag"(value: { "flag": string; "value"?: number; "date"?: string; "days"?: number } | CwtNode): boolean;
  /** Returns true if the game has the specified custom difficulty on. CWT: Config/triggers.cwt:1120. */
  "has_custom_difficulty_setting"(value: string): boolean;
  /** Checks if player has a DLC. Example: has_dlc = "name of the dlc". CWT: Config/triggers.cwt:176. */
  "has_dlc"(value: string): boolean;
  /** Checks if current scope or global scope has the specified event target saved. CWT: Config/triggers.cwt:1570. */
  "has_event_target"(value: string): boolean;
  /** Checks if a game rule is set to a particular option. CWT: Config/triggers.cwt:1751. */
  "has_game_rule"(value: { "rule": string; "option": string } | CwtNode): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:155. */
  "has_global_flag"(value: string): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:160. */
  "has_global_flag"(value: { "flag": string; "value"?: number; "date"?: string; "days"?: number } | CwtNode): boolean;
  /** Checks if the current character has a country leader role matching the sub-ideology. CWT: Config/triggers_nsb.cwt:291. */
  "has_ideology"(value: string): boolean;
  /** Checks if the current character has a country leader role matching the ideology group. CWT: Config/triggers_nsb.cwt:295. */
  "has_ideology_group"(value: string): boolean;
  /** Checks if the current character has a navy ledger. CWT: Config/triggers_nsb.cwt:258. */
  "has_navy_ledger"(value: boolean): boolean;
  /** Checks if a state contains a railway at or above the specified level. CWT: Config/triggers_nsb.cwt:29. */
  "has_railway_level"(value: { "level": number; "state": StateRef } | CwtNode): boolean;
  /** Checks if the scientist of the character in scope matches the skill level condition for a specialization. Supports < > = operators. CWT: Config/triggers_gtd.cwt:13. */
  "has_scientist_level"(value: { "level": number; "specialization": string } | CwtNode): boolean;
  /** Compare the initial start date of current game. CWT: Config/triggers.cwt:615. */
  "has_start_date"(value: string): boolean;
  /** Check if sides leader has trait. CWT: Config/triggers.cwt:671. */
  "has_trait"(value: string): boolean;
  /** Has unit leader flag been setCheck flag val date set and days since set. CWT: Config/triggers.cwt:1510. */
  "has_unit_leader_flag"(value: string): boolean;
  /** Has unit leader flag been setCheck flag val date set and days since set. CWT: Config/triggers.cwt:1514. */
  "has_unit_leader_flag"(value: { "flag": string; "value"?: number; "date"?: string; "days"?: number } | CwtNode): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1550. */
  "has_variable"(value: string): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1554. */
  "has_variable"(value: number): boolean;
  /** Trigger not shown in tooltips. CWT: Config/triggers.cwt:2114. */
  "hidden_trigger"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:14. */
  "if"(value: CwtNode): boolean;
  /** Checks if the scientist of the character in scope is assigned to a project CWT: Config/triggers_gtd.cwt:20. */
  "is_active_scientist"(value: boolean): boolean;
  /** Checks if the current character is an advisor. CWT: Config/triggers_nsb.cwt:206. */
  "is_advisor"(value: boolean): boolean;
  /** Checks if the current character is an air chief. CWT: Config/triggers_nsb.cwt:222. */
  "is_air_chief"(value: boolean): boolean;
  /** Checks if the current character is an army chief. CWT: Config/triggers_nsb.cwt:202. */
  "is_army_chief"(value: boolean): boolean;
  /** Checks if the current character is an army leader. CWT: Config/triggers_nsb.cwt:238. */
  "is_army_leader"(value: boolean): boolean;
  /** Checks if a the combatant or leader has a border war. CWT: Config/triggers.cwt:1586. */
  "is_border_war"(value: boolean): boolean;
  /** Checks whether the character matches the character ID CWT: Config/triggers_nsb.cwt:115. */
  "is_character"(value: string): boolean;
  /** Checks whether the character matches the scope CWT: Config/triggers_nsb.cwt:130. */
  "is_character"(value: CwtOpaque): boolean;
  /** Checks if the current character is in the character slot. CWT: Config/triggers_nsb.cwt:266. */
  "is_character_slot"(value: string): boolean;
  /** Checks if the current character is a corps commander. CWT: Config/triggers_nsb.cwt:242. */
  "is_corps_commander"(value: boolean): boolean;
  /** Checks if the current character is a country leader. CWT: Config/triggers_nsb.cwt:230. */
  "is_country_leader"(value: boolean): boolean;
  /** Returns true if game is in debug mode (launched with -debug argument). CWT: Config/triggers_new.cwt:86. */
  "is_debug"(value: boolean): boolean;
  /** Checks if scope leader is from an exiled government. is_exiled_leader = yes. CWT: Config/triggers.cwt:1681. */
  "is_exiled_leader"(value: true): boolean;
  /** Checks if scope leader is from specified exiled government. is_exiled_leader_from = FRA. CWT: Config/triggers.cwt:1700. */
  "is_exiled_leader_from"(value: CountryRef): boolean;
  /** Checks if scoped unit leader, ace or country is female. CWT: Config/triggers_new.cwt:19. */
  "is_female"(value: boolean): boolean;
  /** Is_field_marshal = yes/no - Checks if the current unit leader is a field marshall. CWT: Config/triggers.cwt:1506. */
  "is_field_marshal"(value: boolean): boolean;
  /** Checks if the scoped unit leader (general) is captured (by any country) CWT: Config/triggers_taog.cwt:45. */
  "is_general_captured"(value: boolean): boolean;
  /** Checks if the current character is in high command. CWT: Config/triggers_nsb.cwt:226. */
  "is_high_command"(value: boolean): boolean;
  /**  CWT: Config/triggers_bba.cwt:135. */
  "is_hired_as_advisor"(value: boolean): boolean;
  /** Check if the historical focus is active. CWT: Config/triggers.cwt:992. */
  "is_historical_focus_on"(value: boolean): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1762. */
  "is_in_array"(value: { "array": string | CwtOpaque; "value": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1769. */
  "is_in_array"(value: CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1775. */
  "is_in_array"(value: { "variable_field_32": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Checks if the character is in a specific state. Works for deployed generals (HQ location), scientists (facility location including faction programs), and operatives (mission location). CWT: Config/triggers_taog.cwt:16. */
  "is_in_state"(value: StateRef): boolean;
  /** Check if current game is ironman. CWT: Config/triggers.cwt:611. */
  "is_ironman"(value: boolean): boolean;
  /** Is_leading_army = yes/no - Checks if the current unit leader is leading a single army (not army group). CWT: Config/triggers.cwt:1631. */
  "is_leading_army"(value: boolean): boolean;
  /** Is_leading_army_group = yes/no - Checks if the current unit leader is leading an army group (not single army). CWT: Config/triggers.cwt:1627. */
  "is_leading_army_group"(value: boolean): boolean;
  /** checks if the current unit leader is leading an army that has any division in a specific province CWT: Config/triggers_ncns.cwt:606. */
  "is_leading_army_in_province"(value: number): boolean;
  /** checks if the current unit leader is leading an army that has any division in a specific province CWT: Config/triggers_ncns.cwt:610. */
  "is_leading_army_in_province"(value: { "province": number; "include_field_marshal": boolean } | CwtNode): boolean;
  /** Is leading volunteers in the target. CWT: Config/triggers_new.cwt:450. */
  "is_leading_volunteer_group"(value: CountryRef): boolean;
  /** Is leading volunteers in a country with the original tag. CWT: Config/triggers_new.cwt:458. */
  "is_leading_volunteer_group_with_original_country"(value: CountryRef): boolean;
  /** Checks if the current character is a navy chief. CWT: Config/triggers_nsb.cwt:218. */
  "is_navy_chief"(value: boolean): boolean;
  /** Checks if the current character is a navy leader. CWT: Config/triggers_nsb.cwt:246. */
  "is_navy_leader"(value: boolean): boolean;
  /** Checks if the current character is an operative. CWT: Config/triggers_nsb.cwt:250. */
  "is_operative"(value: boolean): boolean;
  /** Checks if the current character is a political advisor. CWT: Config/triggers_nsb.cwt:210. */
  "is_political_advisor"(value: boolean): boolean;
  /** Checks if a unit leader was promoted from a unit (division or ship). CWT: Config/triggers_taog.cwt:53. */
  "is_promoted_from_unit"(value: boolean): boolean;
  /** Checks if the scientist of the character in scope is injured CWT: Config/triggers_gtd.cwt:53. */
  "is_scientist_injured"(value: boolean): boolean;
  /** Checks if the current character is a theorist. CWT: Config/triggers_nsb.cwt:214. */
  "is_theorist"(value: boolean): boolean;
  /** Check if the tutorial is active. CWT: Config/triggers.cwt:988. */
  "is_tutorial"(value: boolean): boolean;
  /** Checks if the current character is a unit leader. CWT: Config/triggers_nsb.cwt:234. */
  "is_unit_leader"(value: boolean): boolean;
  /** All inside trigger must be true. At least one entry inside trigger must be true. Negates content of trigger. Print message to game.log - Can be localized. CWT: Config/triggers_new.cwt:15. */
  "log"(value: string): boolean;
  /** Compares logistics skill level of a unit leader. CWT: Config/triggers.cwt:1619. */
  "logistics_skill_level"(value: number): boolean;
  /** Meta triggers can be used for building triggers from strings and running them. following example will test if Germany has 42 pp. CWT: Config/triggers.cwt:1951. */
  "meta_trigger"(value: CwtNode): boolean;
  /** Modulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:161. */
  "modulo_temp_variable"(value: CwtNode): boolean;
  /** Mdulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:167. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:93. */
  "multiply_temp_variable"(value: CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:100. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /**  CWT: Config/scopes.cwt:34. */
  "NOT"(value: CwtNode): boolean;
  /** Checks if the current character is not hired, with the exception of the specified slot. CWT: Config/triggers_nsb.cwt:270. */
  "not_already_hired_except_as"(value: string): boolean;
  /**  CWT: Config/scopes.cwt:42. */
  "OR"(value: CwtNode): boolean;
  /** Compares the amount of turns that have passed during the peace conference with a number. CWT: Config/triggers_bba.cwt:175. */
  "pc_turn"(value: number): boolean;
  /** Compares planning skill level of a unit leader. CWT: Config/triggers.cwt:1623. */
  "planning_skill_level"(value: number): boolean;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/triggers.cwt:1635. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:143. */
  "randomize_temp_variable"(value: string): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:147. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1811. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1824. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1833. */
  "remove_from_temp_array"(value: CwtNode): boolean;
  /** Check amount of reserves. CWT: Config/triggers.cwt:76. */
  "reserves"(value: number): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1851. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1863. */
  "resize_temp_array"(value: CwtNode): boolean;
  /** Rounds a temporary variable. CWT: Config/variable_triggers_temp.cwt:200. */
  "round_temp_variable"(value: string): boolean;
  /** Check if the current scope exist. CWT: Config/triggers_gtd.cwt:104. */
  "scope_exists"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:1. */
  "scope_field"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:3. */
  "set_temp_variable"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:38. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:174. */
  "set_temp_variable_to_random"(value: string): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:178. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): boolean;
  /** Compare leader skill levels. CWT: Config/triggers.cwt:34. */
  "skill"(value: number): boolean;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:82. */
  "subtract_from_temp_variable"(value: CwtNode): boolean;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_triggers_temp.cwt:89. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Check the global threat value. 0-1 value. CWT: Config/triggers.cwt:142. */
  "threat"(value: number): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:706. */
  "tooltip_evaluation"(value: "eval"): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:733. */
  "tooltip_evaluation"(value: "no_eval"): boolean;
}
export interface GeneratedUnitLeaderEffects {
  /**  CWT: Config/effects_nsb.cwt:298. */
  "add_advisor_role"(value: { "character"?: string | CwtOpaque; "activate"?: boolean; "advisor": { "slot": string; "idea_token"?: string; "name"?: string; "desc"?: string; "traits": readonly (string)[]; "research_bonus"?: CwtNode; "ledger"?: string; "cost"?: number; "removal_cost"?: number; "ai_will_do"?: CwtNode; "modifier"?: CwtNode; "can_be_fired"?: boolean } | CwtNode } | CwtNode): void;
  /** Adds attack skill to a unit leader. CWT: Config/effects.cwt:2371. */
  "add_attack"(value: number): void;
  /** Adds maneuver skill to a unit leader. CWT: Config/effects.cwt:2767. */
  "add_coordination"(value: number): void;
  /**  CWT: Config/effects_nsb.cwt:65. */
  "add_corps_commander_role"(value: { "character"?: string | CwtOpaque; "desc"?: string; "traits"?: readonly (string)[]; "skill"?: number; "attack_skill"?: number; "defense_skill"?: number; "planning_skill"?: number; "logistics_skill"?: number; "female"?: boolean; "legacy_id"?: string; "visible"?: CwtNode } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:234. */
  "add_country_leader_role"(value: { "character"?: string | CwtOpaque; "promote_leader"?: boolean; "country_leader": { "desc"?: string; "ideology": string; "traits"?: readonly (string)[]; "expire"?: string; "id"?: number } | CwtNode } | CwtNode): void;
  /** Adds defense skill to a unit leader. CWT: Config/effects.cwt:2375. */
  "add_defense"(value: number): void;
  /** Add divisional commander xp to unit CWT: Config/effects_new.cwt:1018. */
  "add_divisional_commander_xp"(value: number): void;
  /** Adds the specified equipment bonuses to the country. As description the given loc key or the name of given special project will be used. Same usage as in Ideas/National spirits CWT: Config/effects_gtd.cwt:120. */
  "add_equipment_bonus"(value: { "name"?: string; "project"?: CwtOpaque; "bonus": CwtNode } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:153. */
  "add_field_marshal_role"(value: { "character"?: string | CwtOpaque; "desc"?: string; "traits"?: readonly (string)[]; "skill": number; "attack_skill": number; "defense_skill": number; "planning_skill": number; "logistics_skill": number; "legacy_id"?: string; "visible"?: CwtNode } | CwtNode): void;
  /** Adds logistics skill to a unit leader. CWT: Config/effects.cwt:2419. */
  "add_logistics"(value: number): void;
  /** Adds maneuver skill to a unit leader. CWT: Config/effects.cwt:2763. */
  "add_maneuver"(value: number): void;
  /** Adds a max assignable trait slot for a general. CWT: Config/effects.cwt:2435. */
  "add_max_trait"(value: number): void;
  /** Adds new namespace. CWT: Config/effects.cwt:761. */
  "add_namespace"(value: string | number | boolean | CountryRef | StateRef): void;
  /**  CWT: Config/effects_nsb.cwt:194. */
  "add_naval_commander_role"(value: { "character"?: string | CwtOpaque; "desc"?: string; "traits"?: readonly (string)[]; "skill": number; "attack_skill": number; "defense_skill": number; "maneuvering_skill": number; "coordination_skill": number; "legacy_id"?: string; "visible"?: CwtNode } | CwtNode): void;
  /** Adds planning skill to a unit leader. CWT: Config/effects.cwt:2379. */
  "add_planning"(value: number): void;
  /** Add random trait from specified list to unit leader. add_random_trait = { old_guard brilliant_strategist inflexible_strategist }. CWT: Config/effects.cwt:2735. */
  "add_random_trait"(value: readonly (string)[]): void;
  /** Add efficiency factor to strategic region for from country. CWT: Config/effects.cwt:2342. */
  "add_region_efficiency"(value: "replace_me"): void;
  /** Adds a skill level to a unit leader. CWT: Config/effects.cwt:2439. */
  "add_skill_level"(value: number): void;
  /** Adds either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:154. */
  "add_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /** Add a timed trait to unit leader. CWT: Config/effects.cwt:2443. */
  "add_timed_unit_leader_trait"(value: { "trait": string; "days": number } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2824. */
  "add_to_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2846. */
  "add_to_array"(value: CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2943. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2965. */
  "add_to_temp_array"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:122. */
  "add_to_temp_variable"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:129. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:67. */
  "add_to_variable"(value: CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:71. */
  "add_to_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** makes character head of their ideology party CWT: Config/effects_nsb.cwt:510. */
  "add_trait"(value: { "character"?: string | CwtOpaque; "trait": string; "ideology"?: string; "slot"?: string } | CwtNode): void;
  /** Add trait to unit leader. CWT: Config/effects.cwt:757. */
  "add_unit_leader_trait"(value: string): void;
  /** Adds victory point to province. CWT: Config/effects_new.cwt:957. */
  "add_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:51. */
  "AND"(value: CwtNode): void;
  /** Boost planning of units that are belongs to the army group/navy of this unit leader. CWT: Config/effects.cwt:2338. */
  "boost_planning"(value: number): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1372. */
  "break"(value: "none"): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1376. */
  "break"(value: true): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:844. */
  "build_railway"(value: { "path": readonly (number)[]; "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:878. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_province": number; "target_province": number; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:915. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_state": StateRef; "target_state": StateRef; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_effects_temp.cwt:242. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): void;
  /** Clamps a variable between two a values or another variables. CWT: Config/variable_effects.cwt:188. */
  "clamp_variable"(value: { "var": CwtOpaque; "min"?: number | string; "max"?: number | string } | CwtNode): void;
  /** Clears the contents of array. CWT: Config/effects.cwt:2907. */
  "clear_array"(value: string | CwtOpaque): void;
  /** Clear a global event target. CWT: Config/effects.cwt:1364. */
  "clear_global_event_target"(value: string): void;
  /** Clear all global event targets. CWT: Config/effects.cwt:1368. */
  "clear_global_event_targets"(value: true): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3016. */
  "clear_temp_array"(value: string): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3019. */
  "clear_temp_array"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:206. */
  "clear_variable"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:210. */
  "clear_variable"(value: CwtOpaque): void;
  /**  CWT: Config/effects_nsb.cwt:498. */
  "clr_character_flag"(value: string): void;
  /** Clear global flag. CWT: Config/effects.cwt:170. */
  "clr_global_flag"(value: string): void;
  /** Clear unit leader flag. CWT: Config/effects.cwt:2307. */
  "clr_unit_leader_flag"(value: string): void;
  /** Creates a dynamic country and runs child effects on it. CWT: Config/effects_new.cwt:327. */
  "create_dynamic_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Creates an enitity Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. For comparison, default minimum zoom level (closest to the map) is 50 units, while default maximum CWT: Config/effects_nsb.cwt:823. */
  "create_entity"(value: { "entity": string; "id"?: string; "var"?: string; "x"?: number; "y"?: number; "z"?: number; "province"?: number; "state"?: StateRef; "rotation": number; "scale": number; "min_zoom": number; "visible"?: string } | CwtNode): void;
  /** Creates a purchase contract between the countries CWT: Config/effects_aat.cwt:253. */
  "create_purchase_contract"(value: { "seller": CountryRef; "buyer": CountryRef; "civilian_factories": number; "equipment": { "type": string; "amount": number } | CwtNode } | CwtNode): void;
  /** Create railway gun effect CWT: Config/effects_nsb.cwt:713. */
  "create_railway_gun"(value: { "equipment": string; "name"?: string; "location"?: number } | CwtNode): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:14. */
  "custom_effect_tooltip"(value: string): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:17. */
  "custom_effect_tooltip"(value: CwtNode): void;
  /** Executes the provided effects but with a custom tooltip surpressing all tooltips from all other effects inside this block. The custom tooltip is a [bindable localization] CWT: Config/effects_gtd.cwt:318. */
  "custom_override_tooltip"(value: CwtNode): void;
  /** damages units for given conditions. no tooltip generated CWT: Config/effects_nsb.cwt:666. */
  "damage_units"(value: { "province"?: number; "state"?: StateRef; "region"?: string; "limit"?: CwtNode; "damage"?: number; "org_damage"?: number; "str_damage"?: number; "ratio"?: boolean; "template"?: string; "division_template"?: string; "army"?: boolean; "navy"?: boolean } | CwtNode): void;
  /** Demotes field marshal to general. CWT: Config/effects.cwt:2311. */
  "demote_leader"(value: true): void;
  /** Destroys an existing entity IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:849. */
  "destroy_entity"(value: string): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:155. */
  "divide_temp_variable"(value: CwtNode): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:179. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:91. */
  "divide_variable"(value: CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:116. */
  "divide_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Shows just tooltip of effects. CWT: Config/effects.cwt:1510. */
  "effect_tooltip"(value: CwtNode): void;
  /** Use after (else_)if for a catch-all case. CWT: Config/effects.cwt:431. */
  "else"(value: CwtNode): void;
  /** Use after (else_)if to check other triggers only if first if fails. CWT: Config/effects.cwt:422. */
  "else_if"(value: CwtNode): void;
  /** Shows event option tooltip CWT: Config/effects.cwt:27. */
  "event_option_tooltip"(value: string): void;
  /** - Example *every_collection_element = { limit = { xxx } add_political_power = 1 } - Some collections, like 'country:faction_members', require country scope - Supports 'limit' trigger Applies arbitrary effects to all elements of a collection. Supports both anonymous and regular collections CWT: Config/effects_ncns.cwt:248. */
  "every_collection_element"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfills the "limit" trigger. CWT: Config/effects.cwt:205. */
  "every_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a all countries with original tag. tooltip=key can be defined to override tooltip title. CWT: Config/effects_new.cwt:445. */
  "every_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfils the "limit" trigger. Difference with every_country is that it includes countries not yet present on the map. tooltip=key can be defined to override tooltip title. CWT: Config/effects_nsb.cwt:599. */
  "every_possible_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1067. */
  "every_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/effects.cwt:3261. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/effects.cwt:3247. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array. CWT: Config/effects.cwt:3042. */
  "for_each_loop"(value: CwtNode): void;
  /** Runs a loop on for each element of an array and changes scope to current element in each iteration. CWT: Config/effects.cwt:3068. */
  "for_each_scope_loop"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Runs a same effects through a loop. example will run the effects for value_name = -3, 0, 3, 6, 9 and then terminate. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. Consider using for_each_loop instead. CWT: Config/effects.cwt:3175. */
  "for_loop_effect"(value: CwtNode): void;
  /** Executes children effects on army leaders for every country in the world that fulfills the "limit" trigger. Better to use every_army_leader if you know the country. CWT: Config/effects.cwt:2355. */
  "global_every_army_leader"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Goes to stated province. CWT: Config/effects.cwt:1690. */
  "goto_province"(value: number): void;
  /** Goes to stated state. CWT: Config/effects.cwt:1694. */
  "goto_state"(value: StateRef): void;
  /** Effect not shown in tooltips. CWT: Config/effects.cwt:3783. */
  "hidden_effect"(value: CwtNode): void;
  /** A conditional effect. CWT: Config/effects.cwt:413. */
  "if"(value: CwtNode): void;
  /** Print message to game.log - Can be localized. CWT: Config/effects.cwt:493. */
  "log"(value: string): void;
  /** Meta effects can be used for building effects from strings and running them. following example will give Germany 42 pp. CWT: Config/effects.cwt:3214. */
  "meta_effect"(value: CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:493. */
  "modify_character_flag"(value: { "flag": string; "value": number } | CwtNode): void;
  /** Modify global flag. Only modifies if flag already exists. CWT: Config/effects.cwt:2071. */
  "modify_global_flag"(value: { "flag": string; "value"?: number; "days"?: number } | CwtNode): void;
  /** Modify unit leader flag. Only modifies if flag already exists. CWT: Config/effects.cwt:2297. */
  "modify_unit_leader_flag"(value: { "flag": string; "value"?: number; "days"?: number } | CwtNode): void;
  /** Modulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:213. */
  "modulo_temp_variable"(value: CwtNode): void;
  /** Mdulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:219. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:155. */
  "modulo_variable"(value: CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:161. */
  "modulo_variable"(value: { "var": CwtOpaque; "value": number } | CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:144. */
  "multiply_temp_variable"(value: CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:151. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:83. */
  "multiply_variable"(value: CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:87. */
  "multiply_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:44. */
  "NOT"(value: CwtNode): void;
  /**  CWT: Config/scopes.cwt:52. */
  "OR"(value: CwtNode): void;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/effects.cwt:2572. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): void;
  /** makes character head of their ideology party CWT: Config/effects_nsb.cwt:458. */
  "promote_character"(value: boolean): void;
  /** makes character head of their ideology party CWT: Config/effects_nsb.cwt:461. */
  "promote_character"(value: string): void;
  /** makes character head of their ideology party CWT: Config/effects_nsb.cwt:467. */
  "promote_character"(value: { "ideology": string } | CwtNode): void;
  /** Promotes general to field marshal. CWT: Config/effects.cwt:566. */
  "promote_leader"(value: boolean): void;
  /** Promote the officer of the division to a general scope = unit CWT: Config/effects_gtd.cwt:298. */
  "promote_officer_to_general"(value: boolean): void;
  /** A possible random effect that can occur. CWT: Config/effects.cwt:343. */
  "random"(value: CwtNode): void;
  /** Executes children effects on random country that fulfills the "limit" trigger. CWT: Config/effects.cwt:211. */
  "random_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a random country with original tag. CWT: Config/effects_new.cwt:420. */
  "random_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** A list of possible random effects to trigger in this effect. CWT: Config/effects.cwt:355. */
  "random_list"(value: CwtNode): void;
  /** Runs the effect for a random element in array. CWT: Config/effects.cwt:3082. */
  "random_scope_in_array"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on random state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1049. */
  "random_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:194. */
  "randomize_temp_variable"(value: string): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:198. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:132. */
  "randomize_variable"(value: string): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:136. */
  "randomize_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number | string; "max"?: number | string; "lambda"?: number } | CwtNode): void;
  /** Randomize weather effect. CWT: Config/effects.cwt:570. */
  "randomize_weather"(value: number): void;
  /**  CWT: Config/effects_nsb.cwt:366. */
  "remove_advisor_role"(value: { "character"?: string | CwtOpaque; "slot": string } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:273. */
  "remove_country_leader_role"(value: { "character"?: string | CwtOpaque; "ideology"?: string } | CwtNode): void;
  /** Remove exile tag from scope unit leader. remove_exile_tag = yes. CWT: Config/effects.cwt:2742. */
  "remove_exile_tag"(value: true): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2869. */
  "remove_from_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2884. */
  "remove_from_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2894. */
  "remove_from_array"(value: CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2978. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2993. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:3003. */
  "remove_from_temp_array"(value: CwtNode): void;
  /** Removes either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:164. */
  "remove_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:534. */
  "remove_trait"(value: { "character"?: string | CwtOpaque; "trait": string; "ideology"?: string; "slot"?: string } | CwtNode): void;
  /** Remove unit leader role to character CWT: Config/effects_nsb.cwt:118. */
  "remove_unit_leader_role"(value: boolean): void;
  /**  CWT: Config/effects_nsb.cwt:123. */
  "remove_unit_leader_role"(value: string): void;
  /** Remove trait from unit leader. CWT: Config/effects.cwt:753. */
  "remove_unit_leader_trait"(value: string): void;
  /** Add trait to unit leader. CWT: Config/effects.cwt:2431. */
  "replace_unit_leader_trait"(value: "replace_me"): void;
  /** Reset name of a province back to localization one. CWT: Config/effects.cwt:2120. */
  "reset_province_name"(value: number): void;
  /** Resizes array. CWT: Config/effects.cwt:2911. */
  "resize_array"(value: { "array": string; "value"?: number | string; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes array. CWT: Config/effects.cwt:2928. */
  "resize_array"(value: CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3023. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3035. */
  "resize_temp_array"(value: CwtNode): void;
  /** Retires scope unit leader. CWT: Config/effects.cwt:2315. */
  "retire"(value: boolean): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:397. */
  "retire_character"(value: string): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:409. */
  "retire_character"(value: CwtOpaque): void;
  /** Rounds a temporary variable. CWT: Config/variable_effects_temp.cwt:252. */
  "round_temp_variable"(value: string): void;
  /** Rounds a variable. CWT: Config/variable_effects.cwt:202. */
  "round_variable"(value: CwtOpaque): void;
  /** Save an event target. CWT: Config/effects.cwt:1356. */
  "save_event_target_as"(value: string): void;
  /** Save a global event target. CWT: Config/effects.cwt:1360. */
  "save_global_event_target_as"(value: string): void;
  /**  CWT: Config/scopes.cwt:32. */
  "scope_field"(value: CwtNode): void;
  /**  CWT: Config/effects_bba.cwt:92. */
  "set_can_be_fired_in_advisor_role"(value: { "character"?: string | CwtOpaque; "slot"?: string; "value": boolean } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:482. */
  "set_character_flag"(value: string): void;
  /**  CWT: Config/effects_nsb.cwt:485. */
  "set_character_flag"(value: { "flag": string; "value": number; "days"?: number } | CwtNode): void;
  /** renames character CWT: Config/effects_nsb.cwt:413. */
  "set_character_name"(value: string): void;
  /** renames character CWT: Config/effects_nsb.cwt:419. */
  "set_character_name"(value: { "character"?: string | CwtOpaque; "name": string } | CwtNode): void;
  /** Sets the animation of a specified entity IDs are set by the create_entity effect. Animations are defined within the /Hearts of Iron IV/gfx/models/** /*.asset files. CWT: Config/effects_nsb.cwt:903. */
  "set_entity_animation"(value: { "id": string; "animation": string } | CwtNode): void;
  /** Sets the position and rotation of an entity using two coordinates. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:855. */
  "set_entity_movement"(value: { "id": string; "start": { "x": number; "y": number; "z"?: number } | CwtNode; "target": { "province": number } | CwtNode; "ratio": number; "rotation": number } | CwtNode): void;
  /** Sets the position of an existing entity. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. CWT: Config/effects_nsb.cwt:873. */
  "set_entity_position"(value: { "id": string; "x": number; "y": number; "z"?: number; "province": "enum"; "state": StateRef } | CwtNode): void;
  /** Sets the currently-facing angle of an existing entity. IDs are set by the create_entity effect. A positive change results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:887. */
  "set_entity_rotation"(value: { "id": string; "rotation": number } | CwtNode): void;
  /** Sets the size of an existing entity. IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:895. */
  "set_entity_scale"(value: { "id": string; "scale": number } | CwtNode): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:269. */
  "set_faction_military_unlocked"(value: boolean): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:265. */
  "set_faction_research_unlocked"(value: boolean): void;
  /** Set global flag. CWT: Config/effects.cwt:157. */
  "set_global_flag"(value: string): void;
  /** Set global flag. CWT: Config/effects.cwt:160. */
  "set_global_flag"(value: { "flag": string; "value": number; "days"?: number } | CwtNode): void;
  /** Changes the description of unit leader. No tooltip is generated. CWT: Config/effects_new.cwt:953. */
  "set_leader_description"(value: string): void;
  /** Changes the name of unit leader. No tooltip is generated. CWT: Config/effects_new.cwt:945. */
  "set_leader_name"(value: string): void;
  /** Changes the portrait of unit leader. No tooltip is generated. CWT: Config/effects_new.cwt:949. */
  "set_leader_portrait"(value: string): void;
  /** Transfer from one country to another for the character in scope. Note that this is not related to operative nationalities added via add_nationality. Note that for operative, this will temporarily lock their slot on the country of origin CWT: Config/effects_nsb.cwt:559. */
  "set_nationality"(value: { "target_country": CountryRef; "character": string | CwtOpaque } | CwtNode): void;
  /** Transfer from one country to another for the character in scope. Note that this is not related to operative nationalities added via add_nationality. Note that for operative, this will temporarily lock their slot on the country of origin CWT: Config/effects_nsb.cwt:572. */
  "set_nationality"(value: CountryRef): void;
  /** Transfer from one country to another for the character in scope. Note that this is not related to operative nationalities added via add_nationality. Note that for operative, this will temporarily lock their slot on the country of origin CWT: Config/effects_nsb.cwt:576. */
  "set_nationality"(value: { "target_country": CountryRef } | CwtNode): void;
  /** set portraits for the target character. Syntax is similar to character files. CWT: Config/effects_nsb.cwt:613. */
  "set_portraits"(value: CwtNode): void;
  /** Set_province_name = { id = <province id> name = <string> } - Set name for a province. CWT: Config/effects.cwt:2109. */
  "set_province_name"(value: { "id": number; "name": string } | CwtNode): void;
  /** # TEMP VARIABLE Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:53. */
  "set_temp_variable"(value: CwtNode): void;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:88. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:226. */
  "set_temp_variable_to_random"(value: string): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:230. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): void;
  /** Set unit leader flag. CWT: Config/effects.cwt:2285. */
  "set_unit_leader_flag"(value: string): void;
  /** Set unit leader flag. CWT: Config/effects.cwt:2288. */
  "set_unit_leader_flag"(value: { "flag": string; "value": number; "days"?: number } | CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:3. */
  "set_variable"(value: CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:37. */
  "set_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:168. */
  "set_variable_to_random"(value: string): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:172. */
  "set_variable_to_random"(value: { "var": string; "min"?: number | string; "max"?: number | string; "integer"?: boolean } | CwtNode): void;
  /** Sets victory point to province. CWT: Config/effects_new.cwt:964. */
  "set_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /** Plays sound effect. CWT: Config/effects.cwt:562. */
  "sound_effect"(value: string): void;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:133. */
  "subtract_from_temp_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_effects_temp.cwt:140. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:75. */
  "subtract_from_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:79. */
  "subtract_from_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Give supply to units being controlled by this leader. CWT: Config/effects.cwt:3291. */
  "supply_units"(value: number): void;
  /**  CWT: Config/effects_nsb.cwt:473. */
  "swap_country_leader_traits"(value: { "remove": string; "add": string; "ideology"?: string } | CwtNode): void;
  /** Fires a unit leader event for owner country. CWT: Config/effects.cwt:2661. */
  "unit_leader_event"(value: { "id": string; "hours"?: number; "days"?: number; "months"?: number; "random_hours"?: number; "random_days"?: number; "random"?: number | CwtNode; "tooltip"?: string } | CwtNode): void;
  /** Fires a unit leader event for owner country. CWT: Config/effects.cwt:2707. */
  "unit_leader_event"(value: string): void;
  /**  CWT: Config/effects.cwt:1381. */
  "unlock_national_focus"(value: string): void;
  /** Runs the effect as long as a trigger is true. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. CWT: Config/effects.cwt:3200. */
  "while_loop_effect"(value: CwtNode): void;
}
export interface GeneratedUnitLeaderTriggers {
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1781. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef; "index"?: "int_variable_field_32" } | CwtNode): boolean;
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1800. */
  "add_to_temp_array"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:71. */
  "add_to_temp_variable"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:78. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Return true if the character has an advisor role and they can be fired. Warning: will return false if the character has no advisor role or it does not match the input slot. You should use has_advisor_role trigger first to really test the can_be_fired flag CWT: Config/triggers_nsb.cwt:410. */
  "advisor_can_be_fired"(value: boolean): boolean;
  /** Return true if the character has an advisor role and they can be fired. Warning: will return false if the character has no advisor role or it does not match the input slot. You should use has_advisor_role trigger first to really test the can_be_fired flag CWT: Config/triggers_nsb.cwt:414. */
  "advisor_can_be_fired"(value: { "slot": string } | CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { all_collection_elements = { ``` Example (anonymous collection): Example: *all_collection_elements = { coll CWT: Config/triggers_ncns.cwt:151. */
  "all_collection_elements"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all countries meets the trigger. CWT: Config/triggers.cwt:223. */
  "all_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if all of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:507. */
  "all_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if all country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:195. */
  "all_country_with_original_tag"(value: CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1887. */
  "all_of"(value: CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1918. */
  "all_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all states meets the trigger. CWT: Config/triggers.cwt:525. */
  "all_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Always returns specified value. CWT: Config/triggers.cwt:146. */
  "always"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:41. */
  "AND"(value: CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { any_collection_element = { ``` Example (anonymous collection): Example: *any_collection_element = { collec CWT: Config/triggers_ncns.cwt:124. */
  "any_collection_element"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any country meets the trigger. CWT: Config/triggers.cwt:89. */
  "any_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:533. */
  "any_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:182. */
  "any_country_with_original_tag"(value: CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:552. */
  "any_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1871. */
  "any_of"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1908. */
  "any_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any other country meets the trigger. Excludes current country. CWT: Config/triggers.cwt:1095. */
  "any_other_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries (except for the current country) fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:571. */
  "any_other_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries and isn't the current country fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:590. */
  "any_other_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any state meets the trigger. CWT: Config/triggers.cwt:505. */
  "any_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** check if any state in the given category meets the trigger. CWT: Config/triggers_gtd.cwt:84. */
  "any_state_in"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Checks if any of the provided states fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:482. */
  "any_state_of"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Compares attack skill level of a unit leader. CWT: Config/triggers.cwt:1611. */
  "attack_skill_level"(value: number): boolean;
  /** Compares the average stats for a unit leader. CWT: Config/triggers.cwt:1607. */
  "average_stats"(value: number): boolean;
  /** Can the character be a country leader. CWT: Config/triggers_nsb.cwt:198. */
  "can_be_country_leader"(value: boolean): boolean;
  /** Check if leader can select a trait. CWT: Config/triggers.cwt:1562. */
  "can_select_trait"(value: string): boolean;
  /** Has character flag been set. Check flag val date set and days since set. CWT: Config/triggers_nsb.cwt:275. */
  "character_flag"(value: { "flag": string; "value"?: number; "date"?: string; "days"?: number } | CwtNode): boolean;
  /** Evaluates a math expression and returns true when the result is non-zero. CWT: Config/triggers_taog.cwt:57. */
  "check_expr"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:93. */
  "check_variable"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:105. */
  "check_variable"(value: { "var": string | number | boolean | CountryRef | StateRef; "value": string | number | boolean | CountryRef | StateRef; "compare"?: string; "tooltip"?: string } | CwtNode): boolean;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_triggers_temp.cwt:190. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1844. */
  "clear_temp_array"(value: string | CwtOpaque): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1847. */
  "clear_temp_array"(value: number): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:167. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "country": CountryRef } | CwtNode): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:186. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "countries": readonly (CountryRef)[] } | CwtNode): boolean;
  /** - Example: *collection_size = { input = collection:my_awesome_collection value > 1 }* - Variables can be used - Multiple comparisons are allowed: value > x value < y - Supported operators: <, >, = (THIS IS NOT TRUE AS OF 1.17.0.7) - Comparison is inclusive, so "value > X" actually means "value >= X" CWT: Config/triggers_ncns.cwt:396. */
  "collection_size"(value: { "input": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "value": number } | CwtNode): boolean;
  /** Returns true if the specified number of sub-triggers return true. CWT: Config/triggers.cwt:1278. */
  "count_triggers"(value: CwtNode): boolean;
  /** Check if the specified country exist. CWT: Config/triggers.cwt:354. */
  "country_exists"(value: CountryRef): boolean;
  /**  CWT: Config/triggers_gtd.cwt:153. */
  "custom_override_tooltip"(value: CwtNode): boolean;
  /** Works as an and-trigger with a custom tooltip. CWT: Config/triggers.cwt:760. */
  "custom_trigger_tooltip"(value: CwtNode): boolean;
  /** Checks for a specific date. CWT: Config/triggers.cwt:619. */
  "date"(value: string): boolean;
  /** Evaluates a math expression and writes the numeric result to the tooltip. CWT: Config/triggers_taog.cwt:31. */
  "debug_math_expr"(value: CwtNode): boolean;
  /** Compares defense skill level of a unit leader. CWT: Config/triggers.cwt:1615. */
  "defense_skill_level"(value: number): boolean;
  /** Check if the difficulty is above or below specified value 0-2 (difficulty enum). Example: difficulty > 0 (above easy). CWT: Config/triggers.cwt:46. */
  "difficulty"(value: number): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:104. */
  "divide_temp_variable"(value: CwtNode): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:128. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:28. */
  "else"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:21. */
  "else_if"(value: CwtNode): boolean;
  /** check cost of equipment production line CWT: Config/triggers_gtd.cwt:108. */
  "equipment_cost"(value: CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/triggers.cwt:2006. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/triggers.cwt:1992. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Returns true if all of the active game rule options allow achievements. CWT: Config/triggers.cwt:1758. */
  "game_rules_allow_achievements"(value: true): boolean;
  /** Does unit leader have the abilityCheck if a unit leader has the ability. CWT: Config/triggers.cwt:1546. */
  "has_ability"(value: string): boolean;
  /** Check if character has specific advisor role CWT: Config/triggers_nsb.cwt:406. */
  "has_advisor_role"(value: string): boolean;
  /** Checks if the current character has an air ledger. CWT: Config/triggers_nsb.cwt:262. */
  "has_air_ledger"(value: boolean): boolean;
  /** Returns true if the game has any custom difficulty on. CWT: Config/triggers.cwt:1124. */
  "has_any_custom_difficulty_setting"(value: boolean): boolean;
  /** Checks if the current character has an army ledger. CWT: Config/triggers_nsb.cwt:254. */
  "has_army_ledger"(value: boolean): boolean;
  /** Has character flag been set. Check flag val date set and days since set. CWT: Config/triggers_nsb.cwt:79. */
  "has_character_flag"(value: string): boolean;
  /** Has character flag been set. Check flag val date set and days since set. CWT: Config/triggers_nsb.cwt:84. */
  "has_character_flag"(value: { "flag": string; "value"?: number; "date"?: string; "days"?: number } | CwtNode): boolean;
  /** Returns true if the game has the specified custom difficulty on. CWT: Config/triggers.cwt:1120. */
  "has_custom_difficulty_setting"(value: string): boolean;
  /** Checks if player has a DLC. Example: has_dlc = "name of the dlc". CWT: Config/triggers.cwt:176. */
  "has_dlc"(value: string): boolean;
  /** Checks if current scope or global scope has the specified event target saved. CWT: Config/triggers.cwt:1570. */
  "has_event_target"(value: string): boolean;
  /** Checks if a game rule is set to a particular option. CWT: Config/triggers.cwt:1751. */
  "has_game_rule"(value: { "rule": string; "option": string } | CwtNode): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:155. */
  "has_global_flag"(value: string): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:160. */
  "has_global_flag"(value: { "flag": string; "value"?: number; "date"?: string; "days"?: number } | CwtNode): boolean;
  /** Check unit leader has specified ID. Don't localize this. Tooltip only for debug. CWT: Config/triggers.cwt:1558. */
  "has_id"(value: number): boolean;
  /** Checks if the current character has a country leader role matching the sub-ideology. CWT: Config/triggers_nsb.cwt:291. */
  "has_ideology"(value: string): boolean;
  /** Checks if the current character has a country leader role matching the ideology group. CWT: Config/triggers_nsb.cwt:295. */
  "has_ideology_group"(value: string): boolean;
  /** Checks if the current character has a navy ledger. CWT: Config/triggers_nsb.cwt:258. */
  "has_navy_ledger"(value: boolean): boolean;
  /** Checks if a state contains a railway at or above the specified level. CWT: Config/triggers_nsb.cwt:29. */
  "has_railway_level"(value: { "level": number; "state": StateRef } | CwtNode): boolean;
  /** Compare the initial start date of current game. CWT: Config/triggers.cwt:615. */
  "has_start_date"(value: string): boolean;
  /** Check if sides leader has trait. CWT: Config/triggers.cwt:671. */
  "has_trait"(value: string): boolean;
  /** Has unit leader flag been setCheck flag val date set and days since set. CWT: Config/triggers.cwt:1510. */
  "has_unit_leader_flag"(value: string): boolean;
  /** Has unit leader flag been setCheck flag val date set and days since set. CWT: Config/triggers.cwt:1514. */
  "has_unit_leader_flag"(value: { "flag": string; "value"?: number; "date"?: string; "days"?: number } | CwtNode): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1550. */
  "has_variable"(value: string): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1554. */
  "has_variable"(value: number): boolean;
  /** Trigger not shown in tooltips. CWT: Config/triggers.cwt:2114. */
  "hidden_trigger"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:14. */
  "if"(value: CwtNode): boolean;
  /** Checks if the current character is an advisor. CWT: Config/triggers_nsb.cwt:206. */
  "is_advisor"(value: boolean): boolean;
  /** Checks if the current character is an air chief. CWT: Config/triggers_nsb.cwt:222. */
  "is_air_chief"(value: boolean): boolean;
  /** Checks if the current character is an army chief. CWT: Config/triggers_nsb.cwt:202. */
  "is_army_chief"(value: boolean): boolean;
  /** Checks if the current character is an army leader. CWT: Config/triggers_nsb.cwt:238. */
  "is_army_leader"(value: boolean): boolean;
  /** Is_assigned = yes/no - Checks if the current unit leader is assigned to command an army/navy. CWT: Config/triggers.cwt:1498. */
  "is_assigned"(value: boolean): boolean;
  /** Checks if a the combatant or leader has a border war. CWT: Config/triggers.cwt:1586. */
  "is_border_war"(value: boolean): boolean;
  /** Checks whether the character matches the character ID CWT: Config/triggers_nsb.cwt:115. */
  "is_character"(value: string): boolean;
  /** Checks whether the character matches the scope CWT: Config/triggers_nsb.cwt:130. */
  "is_character"(value: CwtOpaque): boolean;
  /** Checks if the current character is in the character slot. CWT: Config/triggers_nsb.cwt:266. */
  "is_character_slot"(value: string): boolean;
  /** Checks if the current character is a corps commander. CWT: Config/triggers_nsb.cwt:242. */
  "is_corps_commander"(value: boolean): boolean;
  /** Checks if the current character is a country leader. CWT: Config/triggers_nsb.cwt:230. */
  "is_country_leader"(value: boolean): boolean;
  /** Returns true if game is in debug mode (launched with -debug argument). CWT: Config/triggers_new.cwt:86. */
  "is_debug"(value: boolean): boolean;
  /** Checks if scope leader is from an exiled government. is_exiled_leader = yes. CWT: Config/triggers.cwt:1681. */
  "is_exiled_leader"(value: true): boolean;
  /** Checks if scope leader is from specified exiled government. is_exiled_leader_from = FRA. CWT: Config/triggers.cwt:1700. */
  "is_exiled_leader_from"(value: CountryRef): boolean;
  /** Checks if scoped unit leader, ace or country is female. CWT: Config/triggers_new.cwt:19. */
  "is_female"(value: boolean): boolean;
  /** Is_field_marshal = yes/no - Checks if the current unit leader is a field marshall. CWT: Config/triggers.cwt:1506. */
  "is_field_marshal"(value: boolean): boolean;
  /** Checks if the current character is in high command. CWT: Config/triggers_nsb.cwt:226. */
  "is_high_command"(value: boolean): boolean;
  /**  CWT: Config/triggers_bba.cwt:135. */
  "is_hired_as_advisor"(value: boolean): boolean;
  /** Check if the historical focus is active. CWT: Config/triggers.cwt:992. */
  "is_historical_focus_on"(value: boolean): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1762. */
  "is_in_array"(value: { "array": string | CwtOpaque; "value": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1769. */
  "is_in_array"(value: CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1775. */
  "is_in_array"(value: { "variable_field_32": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Check if current game is ironman. CWT: Config/triggers.cwt:611. */
  "is_ironman"(value: boolean): boolean;
  /** Is_leading_army = yes/no - Checks if the current unit leader is leading a single army (not army group). CWT: Config/triggers.cwt:1631. */
  "is_leading_army"(value: boolean): boolean;
  /** Is_leading_army_group = yes/no - Checks if the current unit leader is leading an army group (not single army). CWT: Config/triggers.cwt:1627. */
  "is_leading_army_group"(value: boolean): boolean;
  /** checks if the current unit leader is leading an army that has any division in a specific province CWT: Config/triggers_ncns.cwt:606. */
  "is_leading_army_in_province"(value: number): boolean;
  /** checks if the current unit leader is leading an army that has any division in a specific province CWT: Config/triggers_ncns.cwt:610. */
  "is_leading_army_in_province"(value: { "province": number; "include_field_marshal": boolean } | CwtNode): boolean;
  /** Is leading volunteers in the target. CWT: Config/triggers_new.cwt:450. */
  "is_leading_volunteer_group"(value: CountryRef): boolean;
  /** Is leading volunteers in a country with the original tag. CWT: Config/triggers_new.cwt:458. */
  "is_leading_volunteer_group_with_original_country"(value: CountryRef): boolean;
  /** Checks if the current character is a navy chief. CWT: Config/triggers_nsb.cwt:218. */
  "is_navy_chief"(value: boolean): boolean;
  /** Checks if the current character is a navy leader. CWT: Config/triggers_nsb.cwt:246. */
  "is_navy_leader"(value: boolean): boolean;
  /** Checks if the current character is an operative. CWT: Config/triggers_nsb.cwt:250. */
  "is_operative"(value: boolean): boolean;
  /** Checks if the current character is a political advisor. CWT: Config/triggers_nsb.cwt:210. */
  "is_political_advisor"(value: boolean): boolean;
  /** Checks if the current character is a theorist. CWT: Config/triggers_nsb.cwt:214. */
  "is_theorist"(value: boolean): boolean;
  /** Check if the tutorial is active. CWT: Config/triggers.cwt:988. */
  "is_tutorial"(value: boolean): boolean;
  /** Checks if the current character is a unit leader. CWT: Config/triggers_nsb.cwt:234. */
  "is_unit_leader"(value: boolean): boolean;
  /** All inside trigger must be true. At least one entry inside trigger must be true. Negates content of trigger. Print message to game.log - Can be localized. CWT: Config/triggers_new.cwt:15. */
  "log"(value: string): boolean;
  /** Compares logistics skill level of a unit leader. CWT: Config/triggers.cwt:1619. */
  "logistics_skill_level"(value: number): boolean;
  /** Meta triggers can be used for building triggers from strings and running them. following example will test if Germany has 42 pp. CWT: Config/triggers.cwt:1951. */
  "meta_trigger"(value: CwtNode): boolean;
  /** Modulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:161. */
  "modulo_temp_variable"(value: CwtNode): boolean;
  /** Mdulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:167. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:93. */
  "multiply_temp_variable"(value: CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:100. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /**  CWT: Config/scopes.cwt:34. */
  "NOT"(value: CwtNode): boolean;
  /** Checks if the current character is not hired, with the exception of the specified slot. CWT: Config/triggers_nsb.cwt:270. */
  "not_already_hired_except_as"(value: string): boolean;
  /** Check number of units commanded by the unit leader. CWT: Config/triggers.cwt:1502. */
  "num_units"(value: number): boolean;
  /** Changes scope to opposing army/navy. CWT: Config/triggers.cwt:2106. */
  "opponent"(value: CwtNode): boolean;
  /**  CWT: Config/scopes.cwt:42. */
  "OR"(value: CwtNode): boolean;
  /** Compares the amount of turns that have passed during the peace conference with a number. CWT: Config/triggers_bba.cwt:175. */
  "pc_turn"(value: number): boolean;
  /** Compares planning skill level of a unit leader. CWT: Config/triggers.cwt:1623. */
  "planning_skill_level"(value: number): boolean;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/triggers.cwt:1635. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:143. */
  "randomize_temp_variable"(value: string): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:147. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1811. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1824. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1833. */
  "remove_from_temp_array"(value: CwtNode): boolean;
  /** Check amount of reserves. CWT: Config/triggers.cwt:76. */
  "reserves"(value: number): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1851. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1863. */
  "resize_temp_array"(value: CwtNode): boolean;
  /** Rounds a temporary variable. CWT: Config/variable_triggers_temp.cwt:200. */
  "round_temp_variable"(value: string): boolean;
  /** Check if the current scope exist. CWT: Config/triggers_gtd.cwt:104. */
  "scope_exists"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:1. */
  "scope_field"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:3. */
  "set_temp_variable"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:38. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:174. */
  "set_temp_variable_to_random"(value: string): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:178. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): boolean;
  /** Compare leader skill levels. CWT: Config/triggers.cwt:34. */
  "skill"(value: number): boolean;
  /** Compare leader skill levels. CWT: Config/triggers.cwt:268. */
  "skill_advantage"(value: number): boolean;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:82. */
  "subtract_from_temp_variable"(value: CwtNode): boolean;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_triggers_temp.cwt:89. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Check the global threat value. 0-1 value. CWT: Config/triggers.cwt:142. */
  "threat"(value: number): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:706. */
  "tooltip_evaluation"(value: "eval"): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:733. */
  "tooltip_evaluation"(value: "no_eval"): boolean;
}
export interface GeneratedOperativeEffects {
  /** Add divisional commander xp to unit CWT: Config/effects_new.cwt:1018. */
  "add_divisional_commander_xp"(value: number): void;
  /** Adds the specified equipment bonuses to the country. As description the given loc key or the name of given special project will be used. Same usage as in Ideas/National spirits CWT: Config/effects_gtd.cwt:120. */
  "add_equipment_bonus"(value: { "name"?: string; "project"?: CwtOpaque; "bonus": CwtNode } | CwtNode): void;
  /** Adds new namespace. CWT: Config/effects.cwt:761. */
  "add_namespace"(value: string | number | boolean | CountryRef | StateRef): void;
  /** Add the specified nationality to the scoped-in operative. CWT: Config/effects_new.cwt:854. */
  "add_nationality"(value: CountryRef): void;
  /** Add efficiency factor to strategic region for from country. CWT: Config/effects.cwt:2342. */
  "add_region_efficiency"(value: "replace_me"): void;
  /** Adds either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:154. */
  "add_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2824. */
  "add_to_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2846. */
  "add_to_array"(value: CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2943. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2965. */
  "add_to_temp_array"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:122. */
  "add_to_temp_variable"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:129. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:67. */
  "add_to_variable"(value: CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:71. */
  "add_to_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Add trait to unit leader. CWT: Config/effects.cwt:757. */
  "add_unit_leader_trait"(value: string): void;
  /** Adds victory point to province. CWT: Config/effects_new.cwt:957. */
  "add_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:51. */
  "AND"(value: CwtNode): void;
  /** Boost planning of units that are belongs to the army group/navy of this unit leader. CWT: Config/effects.cwt:2338. */
  "boost_planning"(value: number): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1372. */
  "break"(value: "none"): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1376. */
  "break"(value: true): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:844. */
  "build_railway"(value: { "path": readonly (number)[]; "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:878. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_province": number; "target_province": number; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:915. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_state": StateRef; "target_state": StateRef; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Capture an operative. Can be used from a scope and a target that is either a country or a unit leader. CWT: Config/effects_new.cwt:123. */
  "capture_operative"(value: { "captured_by": CountryRef; "ignore_death_chance"?: boolean } | CwtNode): void;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_effects_temp.cwt:242. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): void;
  /** Clamps a variable between two a values or another variables. CWT: Config/variable_effects.cwt:188. */
  "clamp_variable"(value: { "var": CwtOpaque; "min"?: number | string; "max"?: number | string } | CwtNode): void;
  /** Clears the contents of array. CWT: Config/effects.cwt:2907. */
  "clear_array"(value: string | CwtOpaque): void;
  /** Clear a global event target. CWT: Config/effects.cwt:1364. */
  "clear_global_event_target"(value: string): void;
  /** Clear all global event targets. CWT: Config/effects.cwt:1368. */
  "clear_global_event_targets"(value: true): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3016. */
  "clear_temp_array"(value: string): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3019. */
  "clear_temp_array"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:206. */
  "clear_variable"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:210. */
  "clear_variable"(value: CwtOpaque): void;
  /** Clear global flag. CWT: Config/effects.cwt:170. */
  "clr_global_flag"(value: string): void;
  /** Creates a dynamic country and runs child effects on it. CWT: Config/effects_new.cwt:327. */
  "create_dynamic_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Creates an enitity Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. For comparison, default minimum zoom level (closest to the map) is 50 units, while default maximum CWT: Config/effects_nsb.cwt:823. */
  "create_entity"(value: { "entity": string; "id"?: string; "var"?: string; "x"?: number; "y"?: number; "z"?: number; "province"?: number; "state"?: StateRef; "rotation": number; "scale": number; "min_zoom": number; "visible"?: string } | CwtNode): void;
  /** Creates a purchase contract between the countries CWT: Config/effects_aat.cwt:253. */
  "create_purchase_contract"(value: { "seller": CountryRef; "buyer": CountryRef; "civilian_factories": number; "equipment": { "type": string; "amount": number } | CwtNode } | CwtNode): void;
  /** Create railway gun effect CWT: Config/effects_nsb.cwt:713. */
  "create_railway_gun"(value: { "equipment": string; "name"?: string; "location"?: number } | CwtNode): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:14. */
  "custom_effect_tooltip"(value: string): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:17. */
  "custom_effect_tooltip"(value: CwtNode): void;
  /** Executes the provided effects but with a custom tooltip surpressing all tooltips from all other effects inside this block. The custom tooltip is a [bindable localization] CWT: Config/effects_gtd.cwt:318. */
  "custom_override_tooltip"(value: CwtNode): void;
  /** Destroys an existing entity IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:849. */
  "destroy_entity"(value: string): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:155. */
  "divide_temp_variable"(value: CwtNode): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:179. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:91. */
  "divide_variable"(value: CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:116. */
  "divide_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Shows just tooltip of effects. CWT: Config/effects.cwt:1510. */
  "effect_tooltip"(value: CwtNode): void;
  /** Use after (else_)if for a catch-all case. CWT: Config/effects.cwt:431. */
  "else"(value: CwtNode): void;
  /** Use after (else_)if to check other triggers only if first if fails. CWT: Config/effects.cwt:422. */
  "else_if"(value: CwtNode): void;
  /** Shows event option tooltip CWT: Config/effects.cwt:27. */
  "event_option_tooltip"(value: string): void;
  /** - Example *every_collection_element = { limit = { xxx } add_political_power = 1 } - Some collections, like 'country:faction_members', require country scope - Supports 'limit' trigger Applies arbitrary effects to all elements of a collection. Supports both anonymous and regular collections CWT: Config/effects_ncns.cwt:248. */
  "every_collection_element"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfills the "limit" trigger. CWT: Config/effects.cwt:205. */
  "every_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a all countries with original tag. tooltip=key can be defined to override tooltip title. CWT: Config/effects_new.cwt:445. */
  "every_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfils the "limit" trigger. Difference with every_country is that it includes countries not yet present on the map. tooltip=key can be defined to override tooltip title. CWT: Config/effects_nsb.cwt:599. */
  "every_possible_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1067. */
  "every_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/effects.cwt:3261. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/effects.cwt:3247. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array. CWT: Config/effects.cwt:3042. */
  "for_each_loop"(value: CwtNode): void;
  /** Runs a loop on for each element of an array and changes scope to current element in each iteration. CWT: Config/effects.cwt:3068. */
  "for_each_scope_loop"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Runs a same effects through a loop. example will run the effects for value_name = -3, 0, 3, 6, 9 and then terminate. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. Consider using for_each_loop instead. CWT: Config/effects.cwt:3175. */
  "for_loop_effect"(value: CwtNode): void;
  /** Force an operative into hiding, preventing them from performing mission. The specified values is subject to modifiers. CWT: Config/effects_new.cwt:683. */
  "force_operative_leader_into_hiding"(value: boolean): void;
  /** Force an operative into hiding, preventing them from performing mission. The specified values is subject to modifiers. CWT: Config/effects_new.cwt:686. */
  "force_operative_leader_into_hiding"(value: number): void;
  /** Free an operative. Can be used from a scope and a target that is either a country or a unit leader. CWT: Config/effects_new.cwt:30. */
  "free_operative"(value: CountryRef): void;
  /** Free an operative. Can be used from a scope and a target that is either a country or a unit leader. CWT: Config/effects_new.cwt:46. */
  "free_operative"(value: { "captured_by": CountryRef } | CwtNode): void;
  /** Executes children effects on army leaders for every country in the world that fulfills the "limit" trigger. Better to use every_army_leader if you know the country. CWT: Config/effects.cwt:2355. */
  "global_every_army_leader"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Goes to stated province. CWT: Config/effects.cwt:1690. */
  "goto_province"(value: number): void;
  /** Goes to stated state. CWT: Config/effects.cwt:1694. */
  "goto_state"(value: StateRef): void;
  /** Harm an operative. The specified value is subject to modifiers. CWT: Config/effects_new.cwt:679. */
  "harm_operative_leader"(value: number): void;
  /** Effect not shown in tooltips. CWT: Config/effects.cwt:3783. */
  "hidden_effect"(value: CwtNode): void;
  /** A conditional effect. CWT: Config/effects.cwt:413. */
  "if"(value: CwtNode): void;
  /** Kills an operative. This will temporarily lock the slot they occupy. CWT: Config/effects_new.cwt:794. */
  "kill_operative"(value: { "killed_by": CountryRef } | CwtNode): void;
  /** Print message to game.log - Can be localized. CWT: Config/effects.cwt:493. */
  "log"(value: string): void;
  /** Meta effects can be used for building effects from strings and running them. following example will give Germany 42 pp. CWT: Config/effects.cwt:3214. */
  "meta_effect"(value: CwtNode): void;
  /** Modify global flag. Only modifies if flag already exists. CWT: Config/effects.cwt:2071. */
  "modify_global_flag"(value: { "flag": string; "value"?: number; "days"?: number } | CwtNode): void;
  /** Modulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:213. */
  "modulo_temp_variable"(value: CwtNode): void;
  /** Mdulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:219. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:155. */
  "modulo_variable"(value: CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:161. */
  "modulo_variable"(value: { "var": CwtOpaque; "value": number } | CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:144. */
  "multiply_temp_variable"(value: CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:151. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:83. */
  "multiply_variable"(value: CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:87. */
  "multiply_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:44. */
  "NOT"(value: CwtNode): void;
  /** Fires a operative leader event for owner country. CWT: Config/effects_new.cwt:705. */
  "operative_leader_event"(value: { "id": string; "originator"?: CountryRef; "recipient"?: CountryRef; "hours"?: number; "days"?: number; "months"?: number; "random_hours"?: number; "random_days"?: number; "random"?: number | CwtNode; "tooltip"?: string; "set_from"?: CountryRef; "set_from_from"?: CountryRef; "set_root"?: CountryRef } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:52. */
  "OR"(value: CwtNode): void;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/effects.cwt:2572. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): void;
  /** Promote the officer of the division to a general scope = unit CWT: Config/effects_gtd.cwt:298. */
  "promote_officer_to_general"(value: boolean): void;
  /** A possible random effect that can occur. CWT: Config/effects.cwt:343. */
  "random"(value: CwtNode): void;
  /** Executes children effects on random country that fulfills the "limit" trigger. CWT: Config/effects.cwt:211. */
  "random_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a random country with original tag. CWT: Config/effects_new.cwt:420. */
  "random_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** A list of possible random effects to trigger in this effect. CWT: Config/effects.cwt:355. */
  "random_list"(value: CwtNode): void;
  /** Runs the effect for a random element in array. CWT: Config/effects.cwt:3082. */
  "random_scope_in_array"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on random state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1049. */
  "random_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:194. */
  "randomize_temp_variable"(value: string): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:198. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:132. */
  "randomize_variable"(value: string): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:136. */
  "randomize_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number | string; "max"?: number | string; "lambda"?: number } | CwtNode): void;
  /** Randomize weather effect. CWT: Config/effects.cwt:570. */
  "randomize_weather"(value: number): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2869. */
  "remove_from_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2884. */
  "remove_from_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2894. */
  "remove_from_array"(value: CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2978. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2993. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:3003. */
  "remove_from_temp_array"(value: CwtNode): void;
  /** Removes either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:164. */
  "remove_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:123. */
  "remove_unit_leader_role"(value: string): void;
  /** Remove trait from unit leader. CWT: Config/effects.cwt:753. */
  "remove_unit_leader_trait"(value: string): void;
  /** Reset name of a province back to localization one. CWT: Config/effects.cwt:2120. */
  "reset_province_name"(value: number): void;
  /** Resizes array. CWT: Config/effects.cwt:2911. */
  "resize_array"(value: { "array": string; "value"?: number | string; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes array. CWT: Config/effects.cwt:2928. */
  "resize_array"(value: CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3023. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3035. */
  "resize_temp_array"(value: CwtNode): void;
  /** Retires scope unit leader. CWT: Config/effects.cwt:2315. */
  "retire"(value: boolean): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:397. */
  "retire_character"(value: string): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:409. */
  "retire_character"(value: CwtOpaque): void;
  /** Rounds a temporary variable. CWT: Config/variable_effects_temp.cwt:252. */
  "round_temp_variable"(value: string): void;
  /** Rounds a variable. CWT: Config/variable_effects.cwt:202. */
  "round_variable"(value: CwtOpaque): void;
  /** Save an event target. CWT: Config/effects.cwt:1356. */
  "save_event_target_as"(value: string): void;
  /** Save a global event target. CWT: Config/effects.cwt:1360. */
  "save_global_event_target_as"(value: string): void;
  /**  CWT: Config/scopes.cwt:32. */
  "scope_field"(value: CwtNode): void;
  /** Sets the animation of a specified entity IDs are set by the create_entity effect. Animations are defined within the /Hearts of Iron IV/gfx/models/** /*.asset files. CWT: Config/effects_nsb.cwt:903. */
  "set_entity_animation"(value: { "id": string; "animation": string } | CwtNode): void;
  /** Sets the position and rotation of an entity using two coordinates. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:855. */
  "set_entity_movement"(value: { "id": string; "start": { "x": number; "y": number; "z"?: number } | CwtNode; "target": { "province": number } | CwtNode; "ratio": number; "rotation": number } | CwtNode): void;
  /** Sets the position of an existing entity. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. CWT: Config/effects_nsb.cwt:873. */
  "set_entity_position"(value: { "id": string; "x": number; "y": number; "z"?: number; "province": "enum"; "state": StateRef } | CwtNode): void;
  /** Sets the currently-facing angle of an existing entity. IDs are set by the create_entity effect. A positive change results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:887. */
  "set_entity_rotation"(value: { "id": string; "rotation": number } | CwtNode): void;
  /** Sets the size of an existing entity. IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:895. */
  "set_entity_scale"(value: { "id": string; "scale": number } | CwtNode): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:269. */
  "set_faction_military_unlocked"(value: boolean): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:265. */
  "set_faction_research_unlocked"(value: boolean): void;
  /** Set global flag. CWT: Config/effects.cwt:157. */
  "set_global_flag"(value: string): void;
  /** Set global flag. CWT: Config/effects.cwt:160. */
  "set_global_flag"(value: { "flag": string; "value": number; "days"?: number } | CwtNode): void;
  /** Transfer from one country to another for the character in scope. Note that this is not related to operative nationalities added via add_nationality. Note that for operative, this will temporarily lock their slot on the country of origin CWT: Config/effects_nsb.cwt:559. */
  "set_nationality"(value: { "target_country": CountryRef; "character": string | CwtOpaque } | CwtNode): void;
  /** Transfer from one country to another for the character in scope. Note that this is not related to operative nationalities added via add_nationality. Note that for operative, this will temporarily lock their slot on the country of origin CWT: Config/effects_nsb.cwt:572. */
  "set_nationality"(value: CountryRef): void;
  /** Transfer from one country to another for the character in scope. Note that this is not related to operative nationalities added via add_nationality. Note that for operative, this will temporarily lock their slot on the country of origin CWT: Config/effects_nsb.cwt:576. */
  "set_nationality"(value: { "target_country": CountryRef } | CwtNode): void;
  /** Set_province_name = { id = <province id> name = <string> } - Set name for a province. CWT: Config/effects.cwt:2109. */
  "set_province_name"(value: { "id": number; "name": string } | CwtNode): void;
  /** # TEMP VARIABLE Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:53. */
  "set_temp_variable"(value: CwtNode): void;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:88. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:226. */
  "set_temp_variable_to_random"(value: string): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:230. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): void;
  /** Set unit leader flag. CWT: Config/effects.cwt:2285. */
  "set_unit_leader_flag"(value: string): void;
  /** Set unit leader flag. CWT: Config/effects.cwt:2288. */
  "set_unit_leader_flag"(value: { "flag": string; "value": number; "days"?: number } | CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:3. */
  "set_variable"(value: CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:37. */
  "set_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:168. */
  "set_variable_to_random"(value: string): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:172. */
  "set_variable_to_random"(value: { "var": string; "min"?: number | string; "max"?: number | string; "integer"?: boolean } | CwtNode): void;
  /** Sets victory point to province. CWT: Config/effects_new.cwt:964. */
  "set_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /** Plays sound effect. CWT: Config/effects.cwt:562. */
  "sound_effect"(value: string): void;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:133. */
  "subtract_from_temp_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_effects_temp.cwt:140. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:75. */
  "subtract_from_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:79. */
  "subtract_from_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** An operative is turned by the specified country. This transfers the operative to the target country and make it appear as killed to the country of origin (increases the death counter and lock the slot). This fires the on_action on_operative_death with as killer the target country. If the target coun CWT: Config/effects_new.cwt:880. */
  "turn_operative"(value: { "turned_by": CountryRef } | CwtNode): void;
  /**  CWT: Config/effects.cwt:1381. */
  "unlock_national_focus"(value: string): void;
  /** Runs the effect as long as a trigger is true. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. CWT: Config/effects.cwt:3200. */
  "while_loop_effect"(value: CwtNode): void;
}
export interface GeneratedOperativeTriggers {
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1781. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef; "index"?: "int_variable_field_32" } | CwtNode): boolean;
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1800. */
  "add_to_temp_array"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:71. */
  "add_to_temp_variable"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:78. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { all_collection_elements = { ``` Example (anonymous collection): Example: *all_collection_elements = { coll CWT: Config/triggers_ncns.cwt:151. */
  "all_collection_elements"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all countries meets the trigger. CWT: Config/triggers.cwt:223. */
  "all_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if all of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:507. */
  "all_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if all country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:195. */
  "all_country_with_original_tag"(value: CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1887. */
  "all_of"(value: CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1918. */
  "all_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all states meets the trigger. CWT: Config/triggers.cwt:525. */
  "all_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Always returns specified value. CWT: Config/triggers.cwt:146. */
  "always"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:41. */
  "AND"(value: CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { any_collection_element = { ``` Example (anonymous collection): Example: *any_collection_element = { collec CWT: Config/triggers_ncns.cwt:124. */
  "any_collection_element"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any country meets the trigger. CWT: Config/triggers.cwt:89. */
  "any_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:533. */
  "any_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:182. */
  "any_country_with_original_tag"(value: CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:552. */
  "any_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1871. */
  "any_of"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1908. */
  "any_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any other country meets the trigger. Excludes current country. CWT: Config/triggers.cwt:1095. */
  "any_other_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries (except for the current country) fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:571. */
  "any_other_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries and isn't the current country fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:590. */
  "any_other_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any state meets the trigger. CWT: Config/triggers.cwt:505. */
  "any_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** check if any state in the given category meets the trigger. CWT: Config/triggers_gtd.cwt:84. */
  "any_state_in"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Checks if any of the provided states fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:482. */
  "any_state_of"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Evaluates a math expression and returns true when the result is non-zero. CWT: Config/triggers_taog.cwt:57. */
  "check_expr"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:93. */
  "check_variable"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:105. */
  "check_variable"(value: { "var": string | number | boolean | CountryRef | StateRef; "value": string | number | boolean | CountryRef | StateRef; "compare"?: string; "tooltip"?: string } | CwtNode): boolean;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_triggers_temp.cwt:190. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1844. */
  "clear_temp_array"(value: string | CwtOpaque): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1847. */
  "clear_temp_array"(value: number): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:167. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "country": CountryRef } | CwtNode): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:186. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "countries": readonly (CountryRef)[] } | CwtNode): boolean;
  /** - Example: *collection_size = { input = collection:my_awesome_collection value > 1 }* - Variables can be used - Multiple comparisons are allowed: value > x value < y - Supported operators: <, >, = (THIS IS NOT TRUE AS OF 1.17.0.7) - Comparison is inclusive, so "value > X" actually means "value >= X" CWT: Config/triggers_ncns.cwt:396. */
  "collection_size"(value: { "input": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "value": number } | CwtNode): boolean;
  /** Returns true if the specified number of sub-triggers return true. CWT: Config/triggers.cwt:1278. */
  "count_triggers"(value: CwtNode): boolean;
  /** Check if the specified country exist. CWT: Config/triggers.cwt:354. */
  "country_exists"(value: CountryRef): boolean;
  /**  CWT: Config/triggers_gtd.cwt:153. */
  "custom_override_tooltip"(value: CwtNode): boolean;
  /** Works as an and-trigger with a custom tooltip. CWT: Config/triggers.cwt:760. */
  "custom_trigger_tooltip"(value: CwtNode): boolean;
  /** Checks for a specific date. CWT: Config/triggers.cwt:619. */
  "date"(value: string): boolean;
  /** Evaluates a math expression and writes the numeric result to the tooltip. CWT: Config/triggers_taog.cwt:31. */
  "debug_math_expr"(value: CwtNode): boolean;
  /** Check if the difficulty is above or below specified value 0-2 (difficulty enum). Example: difficulty > 0 (above easy). CWT: Config/triggers.cwt:46. */
  "difficulty"(value: number): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:104. */
  "divide_temp_variable"(value: CwtNode): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:128. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:28. */
  "else"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:21. */
  "else_if"(value: CwtNode): boolean;
  /** check cost of equipment production line CWT: Config/triggers_gtd.cwt:108. */
  "equipment_cost"(value: CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/triggers.cwt:2006. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/triggers.cwt:1992. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Returns true if all of the active game rule options allow achievements. CWT: Config/triggers.cwt:1758. */
  "game_rules_allow_achievements"(value: true): boolean;
  /** Returns true if the game has any custom difficulty on. CWT: Config/triggers.cwt:1124. */
  "has_any_custom_difficulty_setting"(value: boolean): boolean;
  /** Returns true if the game has the specified custom difficulty on. CWT: Config/triggers.cwt:1120. */
  "has_custom_difficulty_setting"(value: string): boolean;
  /** Checks if player has a DLC. Example: has_dlc = "name of the dlc". CWT: Config/triggers.cwt:176. */
  "has_dlc"(value: string): boolean;
  /** Checks if current scope or global scope has the specified event target saved. CWT: Config/triggers.cwt:1570. */
  "has_event_target"(value: string): boolean;
  /** Checks if a game rule is set to a particular option. CWT: Config/triggers.cwt:1751. */
  "has_game_rule"(value: { "rule": string; "option": string } | CwtNode): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:155. */
  "has_global_flag"(value: string): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:160. */
  "has_global_flag"(value: { "flag": string; "value"?: number; "date"?: string; "days"?: number } | CwtNode): boolean;
  /** Checks whether the operative has the specified nationality. NOTE: this is invalid on non-operatives. CWT: Config/triggers_new.cwt:403. */
  "has_nationality"(value: CountryRef): boolean;
  /** Checks if a state contains a railway at or above the specified level. CWT: Config/triggers_nsb.cwt:29. */
  "has_railway_level"(value: { "level": number; "state": StateRef } | CwtNode): boolean;
  /** Compare the initial start date of current game. CWT: Config/triggers.cwt:615. */
  "has_start_date"(value: string): boolean;
  /** Check if sides leader has trait. CWT: Config/triggers.cwt:671. */
  "has_trait"(value: string): boolean;
  /** Has unit leader flag been setCheck flag val date set and days since set. CWT: Config/triggers.cwt:1510. */
  "has_unit_leader_flag"(value: string): boolean;
  /** Has unit leader flag been setCheck flag val date set and days since set. CWT: Config/triggers.cwt:1514. */
  "has_unit_leader_flag"(value: { "flag": string; "value"?: number; "date"?: string; "days"?: number } | CwtNode): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1550. */
  "has_variable"(value: string): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1554. */
  "has_variable"(value: number): boolean;
  /** Trigger not shown in tooltips. CWT: Config/triggers.cwt:2114. */
  "hidden_trigger"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:14. */
  "if"(value: CwtNode): boolean;
  /** Checks if a the combatant or leader has a border war. CWT: Config/triggers.cwt:1586. */
  "is_border_war"(value: boolean): boolean;
  /** Returns true if game is in debug mode (launched with -debug argument). CWT: Config/triggers_new.cwt:86. */
  "is_debug"(value: boolean): boolean;
  /** Checks if scope leader is from an exiled government. is_exiled_leader = yes. CWT: Config/triggers.cwt:1681. */
  "is_exiled_leader"(value: true): boolean;
  /** Checks if scope leader is from specified exiled government. is_exiled_leader_from = FRA. CWT: Config/triggers.cwt:1700. */
  "is_exiled_leader_from"(value: CountryRef): boolean;
  /** Check if the historical focus is active. CWT: Config/triggers.cwt:992. */
  "is_historical_focus_on"(value: boolean): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1762. */
  "is_in_array"(value: { "array": string | CwtOpaque; "value": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1769. */
  "is_in_array"(value: CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1775. */
  "is_in_array"(value: { "variable_field_32": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Check if current game is ironman. CWT: Config/triggers.cwt:611. */
  "is_ironman"(value: boolean): boolean;
  /** Checks if the current character is an operative. CWT: Config/triggers_nsb.cwt:250. */
  "is_operative"(value: boolean): boolean;
  /** Checks whether the operative has the matching captured status. CWT: Config/triggers_new.cwt:254. */
  "is_operative_captured"(value: boolean): boolean;
  /** Check if the tutorial is active. CWT: Config/triggers.cwt:988. */
  "is_tutorial"(value: boolean): boolean;
  /** All inside trigger must be true. At least one entry inside trigger must be true. Negates content of trigger. Print message to game.log - Can be localized. CWT: Config/triggers_new.cwt:15. */
  "log"(value: string): boolean;
  /** Meta triggers can be used for building triggers from strings and running them. following example will test if Germany has 42 pp. CWT: Config/triggers.cwt:1951. */
  "meta_trigger"(value: CwtNode): boolean;
  /** Modulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:161. */
  "modulo_temp_variable"(value: CwtNode): boolean;
  /** Mdulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:167. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:93. */
  "multiply_temp_variable"(value: CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:100. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /**  CWT: Config/scopes.cwt:34. */
  "NOT"(value: CwtNode): boolean;
  /** Checks whether the operative is performing the given mission. CWT: Config/triggers_new.cwt:225. */
  "operative_leader_mission"(value: string): boolean;
  /** Checks whether the operative is performing the given operation. CWT: Config/triggers_new.cwt:391. */
  "operative_leader_operation"(value: string): boolean;
  /**  CWT: Config/scopes.cwt:42. */
  "OR"(value: CwtNode): boolean;
  /** Compares the amount of turns that have passed during the peace conference with a number. CWT: Config/triggers_bba.cwt:175. */
  "pc_turn"(value: number): boolean;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/triggers.cwt:1635. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:143. */
  "randomize_temp_variable"(value: string): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:147. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1811. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1824. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1833. */
  "remove_from_temp_array"(value: CwtNode): boolean;
  /** Check amount of reserves. CWT: Config/triggers.cwt:76. */
  "reserves"(value: number): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1851. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1863. */
  "resize_temp_array"(value: CwtNode): boolean;
  /** Rounds a temporary variable. CWT: Config/variable_triggers_temp.cwt:200. */
  "round_temp_variable"(value: string): boolean;
  /** Check if the current scope exist. CWT: Config/triggers_gtd.cwt:104. */
  "scope_exists"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:1. */
  "scope_field"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:3. */
  "set_temp_variable"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:38. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:174. */
  "set_temp_variable_to_random"(value: string): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:178. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): boolean;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:82. */
  "subtract_from_temp_variable"(value: CwtNode): boolean;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_triggers_temp.cwt:89. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Check the global threat value. 0-1 value. CWT: Config/triggers.cwt:142. */
  "threat"(value: number): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:706. */
  "tooltip_evaluation"(value: "eval"): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:733. */
  "tooltip_evaluation"(value: "no_eval"): boolean;
}
export interface GeneratedProjectEffects {
  /** Add divisional commander xp to unit CWT: Config/effects_new.cwt:1018. */
  "add_divisional_commander_xp"(value: number): void;
  /** Adds a dynamic modifier to country/state/unit leader. CWT: Config/effects.cwt:3137. */
  "add_dynamic_modifier"(value: { "modifier": string; "scope"?: CountryRef | StateRef | string | CwtOpaque; "days"?: number } | CwtNode): void;
  /** Adds the specified equipment bonuses to the country. As description the given loc key or the name of given special project will be used. Same usage as in Ideas/National spirits CWT: Config/effects_gtd.cwt:120. */
  "add_equipment_bonus"(value: { "name"?: string; "project"?: CwtOpaque; "bonus": CwtNode } | CwtNode): void;
  /** Adds new namespace. CWT: Config/effects.cwt:761. */
  "add_namespace"(value: string | number | boolean | CountryRef | StateRef): void;
  /** Add progress to the project's prototype phase. nThe input value is a ratio of the total needed progress to complete the special project, i.e. a decimal number between -1 and 1. CWT: Config/effects_gtd.cwt:309. */
  "add_project_progress_ratio"(value: number): void;
  /** Add progress to the project's prototype phase. nThe input value is a ratio of the total needed progress to complete the special project, i.e. a decimal number between -1 and 1. CWT: Config/effects_gtd.cwt:312. */
  "add_project_progress_ratio"(value: string): void;
  /** Add efficiency factor to strategic region for from country. CWT: Config/effects.cwt:2342. */
  "add_region_efficiency"(value: "replace_me"): void;
  /** Adds either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:154. */
  "add_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2824. */
  "add_to_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2846. */
  "add_to_array"(value: CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2943. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2965. */
  "add_to_temp_array"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:122. */
  "add_to_temp_variable"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:129. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:67. */
  "add_to_variable"(value: CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:71. */
  "add_to_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Adds victory point to province. CWT: Config/effects_new.cwt:957. */
  "add_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:51. */
  "AND"(value: CwtNode): void;
  /** Boost planning of units that are belongs to the army group/navy of this unit leader. CWT: Config/effects.cwt:2338. */
  "boost_planning"(value: number): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1372. */
  "break"(value: "none"): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1376. */
  "break"(value: true): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:844. */
  "build_railway"(value: { "path": readonly (number)[]; "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:878. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_province": number; "target_province": number; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:915. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_state": StateRef; "target_state": StateRef; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_effects_temp.cwt:242. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): void;
  /** Clamps a variable between two a values or another variables. CWT: Config/variable_effects.cwt:188. */
  "clamp_variable"(value: { "var": CwtOpaque; "min"?: number | string; "max"?: number | string } | CwtNode): void;
  /** Clears the contents of array. CWT: Config/effects.cwt:2907. */
  "clear_array"(value: string | CwtOpaque): void;
  /** Clear a global event target. CWT: Config/effects.cwt:1364. */
  "clear_global_event_target"(value: string): void;
  /** Clear all global event targets. CWT: Config/effects.cwt:1368. */
  "clear_global_event_targets"(value: true): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3016. */
  "clear_temp_array"(value: string): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3019. */
  "clear_temp_array"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:206. */
  "clear_variable"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:210. */
  "clear_variable"(value: CwtOpaque): void;
  /** Clear global flag. CWT: Config/effects.cwt:170. */
  "clr_global_flag"(value: string): void;
  /** clear project flag CWT: Config/effects_gtd.cwt:72. */
  "clr_project_flag"(value: string): void;
  /** Complete a prototype reward option for the project in scope \nThe effect will respect the fire only once and allowed property of prototype rewards. CWT: Config/effects_gtd.cwt:360. */
  "complete_prototype_reward_option"(value: { "prototype_reward": string; "prototype_reward_option"?: string; "show_modifiers"?: boolean } | CwtNode): void;
  /** Creates a dynamic country and runs child effects on it. CWT: Config/effects_new.cwt:327. */
  "create_dynamic_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Creates an enitity Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. For comparison, default minimum zoom level (closest to the map) is 50 units, while default maximum CWT: Config/effects_nsb.cwt:823. */
  "create_entity"(value: { "entity": string; "id"?: string; "var"?: string; "x"?: number; "y"?: number; "z"?: number; "province"?: number; "state"?: StateRef; "rotation": number; "scale": number; "min_zoom": number; "visible"?: string } | CwtNode): void;
  /** Creates a purchase contract between the countries CWT: Config/effects_aat.cwt:253. */
  "create_purchase_contract"(value: { "seller": CountryRef; "buyer": CountryRef; "civilian_factories": number; "equipment": { "type": string; "amount": number } | CwtNode } | CwtNode): void;
  /** Create railway gun effect CWT: Config/effects_nsb.cwt:713. */
  "create_railway_gun"(value: { "equipment": string; "name"?: string; "location"?: number } | CwtNode): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:14. */
  "custom_effect_tooltip"(value: string): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:17. */
  "custom_effect_tooltip"(value: CwtNode): void;
  /** Executes the provided effects but with a custom tooltip surpressing all tooltips from all other effects inside this block. The custom tooltip is a [bindable localization] CWT: Config/effects_gtd.cwt:318. */
  "custom_override_tooltip"(value: CwtNode): void;
  /** Destroys an existing entity IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:849. */
  "destroy_entity"(value: string): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:155. */
  "divide_temp_variable"(value: CwtNode): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:179. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:91. */
  "divide_variable"(value: CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:116. */
  "divide_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Shows just tooltip of effects. CWT: Config/effects.cwt:1510. */
  "effect_tooltip"(value: CwtNode): void;
  /** Use after (else_)if for a catch-all case. CWT: Config/effects.cwt:431. */
  "else"(value: CwtNode): void;
  /** Use after (else_)if to check other triggers only if first if fails. CWT: Config/effects.cwt:422. */
  "else_if"(value: CwtNode): void;
  /** Shows event option tooltip CWT: Config/effects.cwt:27. */
  "event_option_tooltip"(value: string): void;
  /** - Example *every_collection_element = { limit = { xxx } add_political_power = 1 } - Some collections, like 'country:faction_members', require country scope - Supports 'limit' trigger Applies arbitrary effects to all elements of a collection. Supports both anonymous and regular collections CWT: Config/effects_ncns.cwt:248. */
  "every_collection_element"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfills the "limit" trigger. CWT: Config/effects.cwt:205. */
  "every_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a all countries with original tag. tooltip=key can be defined to override tooltip title. CWT: Config/effects_new.cwt:445. */
  "every_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfils the "limit" trigger. Difference with every_country is that it includes countries not yet present on the map. tooltip=key can be defined to override tooltip title. CWT: Config/effects_nsb.cwt:599. */
  "every_possible_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1067. */
  "every_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/effects.cwt:3261. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/effects.cwt:3247. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array. CWT: Config/effects.cwt:3042. */
  "for_each_loop"(value: CwtNode): void;
  /** Runs a loop on for each element of an array and changes scope to current element in each iteration. CWT: Config/effects.cwt:3068. */
  "for_each_scope_loop"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Runs a same effects through a loop. example will run the effects for value_name = -3, 0, 3, 6, 9 and then terminate. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. Consider using for_each_loop instead. CWT: Config/effects.cwt:3175. */
  "for_loop_effect"(value: CwtNode): void;
  /** Updates the modifiers in current scope (use if you don't want to wait for daily update to update them). CWT: Config/effects.cwt:3099. */
  "force_update_dynamic_modifier"(value: true): void;
  /** Executes children effects on army leaders for every country in the world that fulfills the "limit" trigger. Better to use every_army_leader if you know the country. CWT: Config/effects.cwt:2355. */
  "global_every_army_leader"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Goes to stated province. CWT: Config/effects.cwt:1690. */
  "goto_province"(value: number): void;
  /** Goes to stated state. CWT: Config/effects.cwt:1694. */
  "goto_state"(value: StateRef): void;
  /** Effect not shown in tooltips. CWT: Config/effects.cwt:3783. */
  "hidden_effect"(value: CwtNode): void;
  /** A conditional effect. CWT: Config/effects.cwt:413. */
  "if"(value: CwtNode): void;
  /** Print message to game.log - Can be localized. CWT: Config/effects.cwt:493. */
  "log"(value: string): void;
  /** Meta effects can be used for building effects from strings and running them. following example will give Germany 42 pp. CWT: Config/effects.cwt:3214. */
  "meta_effect"(value: CwtNode): void;
  /** Modify global flag. Only modifies if flag already exists. CWT: Config/effects.cwt:2071. */
  "modify_global_flag"(value: { "flag": string; "value"?: number; "days"?: number } | CwtNode): void;
  /** modify project flag. Only modifies if flag already exists. CWT: Config/effects_gtd.cwt:63. */
  "modify_project_flag"(value: { "flag": string; "value"?: number; "days"?: number } | CwtNode): void;
  /** Modulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:213. */
  "modulo_temp_variable"(value: CwtNode): void;
  /** Mdulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:219. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:155. */
  "modulo_variable"(value: CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:161. */
  "modulo_variable"(value: { "var": CwtOpaque; "value": number } | CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:144. */
  "multiply_temp_variable"(value: CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:151. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:83. */
  "multiply_variable"(value: CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:87. */
  "multiply_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:44. */
  "NOT"(value: CwtNode): void;
  /**  CWT: Config/scopes.cwt:52. */
  "OR"(value: CwtNode): void;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/effects.cwt:2572. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): void;
  /** Promote the officer of the division to a general scope = unit CWT: Config/effects_gtd.cwt:298. */
  "promote_officer_to_general"(value: boolean): void;
  /** A possible random effect that can occur. CWT: Config/effects.cwt:343. */
  "random"(value: CwtNode): void;
  /** Executes children effects on random country that fulfills the "limit" trigger. CWT: Config/effects.cwt:211. */
  "random_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a random country with original tag. CWT: Config/effects_new.cwt:420. */
  "random_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** A list of possible random effects to trigger in this effect. CWT: Config/effects.cwt:355. */
  "random_list"(value: CwtNode): void;
  /** Runs the effect for a random element in array. CWT: Config/effects.cwt:3082. */
  "random_scope_in_array"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on random state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1049. */
  "random_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:194. */
  "randomize_temp_variable"(value: string): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:198. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:132. */
  "randomize_variable"(value: string): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:136. */
  "randomize_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number | string; "max"?: number | string; "lambda"?: number } | CwtNode): void;
  /** Randomize weather effect. CWT: Config/effects.cwt:570. */
  "randomize_weather"(value: number): void;
  /** Removes a dynamic modifier from country/state/unit leader. CWT: Config/effects.cwt:3103. */
  "remove_dynamic_modifier"(value: { "modifier": string; "scope"?: CountryRef | StateRef | string | CwtOpaque } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2869. */
  "remove_from_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2884. */
  "remove_from_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2894. */
  "remove_from_array"(value: CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2978. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2993. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:3003. */
  "remove_from_temp_array"(value: CwtNode): void;
  /** Removes either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:164. */
  "remove_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:123. */
  "remove_unit_leader_role"(value: string): void;
  /** Reset name of a province back to localization one. CWT: Config/effects.cwt:2120. */
  "reset_province_name"(value: number): void;
  /** Resizes array. CWT: Config/effects.cwt:2911. */
  "resize_array"(value: { "array": string; "value"?: number | string; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes array. CWT: Config/effects.cwt:2928. */
  "resize_array"(value: CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3023. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3035. */
  "resize_temp_array"(value: CwtNode): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:397. */
  "retire_character"(value: string): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:409. */
  "retire_character"(value: CwtOpaque): void;
  /** Rounds a temporary variable. CWT: Config/variable_effects_temp.cwt:252. */
  "round_temp_variable"(value: string): void;
  /** Rounds a variable. CWT: Config/variable_effects.cwt:202. */
  "round_variable"(value: CwtOpaque): void;
  /** Save an event target. CWT: Config/effects.cwt:1356. */
  "save_event_target_as"(value: string): void;
  /** Save a global event target. CWT: Config/effects.cwt:1360. */
  "save_global_event_target_as"(value: string): void;
  /**  CWT: Config/scopes.cwt:32. */
  "scope_field"(value: CwtNode): void;
  /** Sets the animation of a specified entity IDs are set by the create_entity effect. Animations are defined within the /Hearts of Iron IV/gfx/models/** /*.asset files. CWT: Config/effects_nsb.cwt:903. */
  "set_entity_animation"(value: { "id": string; "animation": string } | CwtNode): void;
  /** Sets the position and rotation of an entity using two coordinates. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:855. */
  "set_entity_movement"(value: { "id": string; "start": { "x": number; "y": number; "z"?: number } | CwtNode; "target": { "province": number } | CwtNode; "ratio": number; "rotation": number } | CwtNode): void;
  /** Sets the position of an existing entity. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. CWT: Config/effects_nsb.cwt:873. */
  "set_entity_position"(value: { "id": string; "x": number; "y": number; "z"?: number; "province": "enum"; "state": StateRef } | CwtNode): void;
  /** Sets the currently-facing angle of an existing entity. IDs are set by the create_entity effect. A positive change results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:887. */
  "set_entity_rotation"(value: { "id": string; "rotation": number } | CwtNode): void;
  /** Sets the size of an existing entity. IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:895. */
  "set_entity_scale"(value: { "id": string; "scale": number } | CwtNode): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:269. */
  "set_faction_military_unlocked"(value: boolean): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:265. */
  "set_faction_research_unlocked"(value: boolean): void;
  /** Set global flag. CWT: Config/effects.cwt:157. */
  "set_global_flag"(value: string): void;
  /** Set global flag. CWT: Config/effects.cwt:160. */
  "set_global_flag"(value: { "flag": string; "value": number; "days"?: number } | CwtNode): void;
  /** set project flag. CWT: Config/effects_gtd.cwt:52. */
  "set_project_flag"(value: string): void;
  /** set project flag. CWT: Config/effects_gtd.cwt:55. */
  "set_project_flag"(value: { "flag": string; "value": number; "days"?: number } | CwtNode): void;
  /** Set_province_name = { id = <province id> name = <string> } - Set name for a province. CWT: Config/effects.cwt:2109. */
  "set_province_name"(value: { "id": number; "name": string } | CwtNode): void;
  /** # TEMP VARIABLE Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:53. */
  "set_temp_variable"(value: CwtNode): void;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:88. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:226. */
  "set_temp_variable_to_random"(value: string): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:230. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:3. */
  "set_variable"(value: CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:37. */
  "set_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:168. */
  "set_variable_to_random"(value: string): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:172. */
  "set_variable_to_random"(value: { "var": string; "min"?: number | string; "max"?: number | string; "integer"?: boolean } | CwtNode): void;
  /** Sets victory point to province. CWT: Config/effects_new.cwt:964. */
  "set_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /** Plays sound effect. CWT: Config/effects.cwt:562. */
  "sound_effect"(value: string): void;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:133. */
  "subtract_from_temp_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_effects_temp.cwt:140. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:75. */
  "subtract_from_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:79. */
  "subtract_from_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /**  CWT: Config/effects.cwt:1381. */
  "unlock_national_focus"(value: string): void;
  /** Runs the effect as long as a trigger is true. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. CWT: Config/effects.cwt:3200. */
  "while_loop_effect"(value: CwtNode): void;
}
export interface GeneratedProjectTriggers {
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1781. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef; "index"?: "int_variable_field_32" } | CwtNode): boolean;
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1800. */
  "add_to_temp_array"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:71. */
  "add_to_temp_variable"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:78. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { all_collection_elements = { ``` Example (anonymous collection): Example: *all_collection_elements = { coll CWT: Config/triggers_ncns.cwt:151. */
  "all_collection_elements"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all countries meets the trigger. CWT: Config/triggers.cwt:223. */
  "all_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if all of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:507. */
  "all_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if all country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:195. */
  "all_country_with_original_tag"(value: CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1887. */
  "all_of"(value: CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1918. */
  "all_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all states meets the trigger. CWT: Config/triggers.cwt:525. */
  "all_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Always returns specified value. CWT: Config/triggers.cwt:146. */
  "always"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:41. */
  "AND"(value: CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { any_collection_element = { ``` Example (anonymous collection): Example: *any_collection_element = { collec CWT: Config/triggers_ncns.cwt:124. */
  "any_collection_element"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any country meets the trigger. CWT: Config/triggers.cwt:89. */
  "any_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:533. */
  "any_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:182. */
  "any_country_with_original_tag"(value: CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:552. */
  "any_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1871. */
  "any_of"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1908. */
  "any_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any other country meets the trigger. Excludes current country. CWT: Config/triggers.cwt:1095. */
  "any_other_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries (except for the current country) fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:571. */
  "any_other_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries and isn't the current country fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:590. */
  "any_other_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any state meets the trigger. CWT: Config/triggers.cwt:505. */
  "any_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** check if any state in the given category meets the trigger. CWT: Config/triggers_gtd.cwt:84. */
  "any_state_in"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Checks if any of the provided states fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:482. */
  "any_state_of"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Evaluates a math expression and returns true when the result is non-zero. CWT: Config/triggers_taog.cwt:57. */
  "check_expr"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:93. */
  "check_variable"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:105. */
  "check_variable"(value: { "var": string | number | boolean | CountryRef | StateRef; "value": string | number | boolean | CountryRef | StateRef; "compare"?: string; "tooltip"?: string } | CwtNode): boolean;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_triggers_temp.cwt:190. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1844. */
  "clear_temp_array"(value: string | CwtOpaque): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1847. */
  "clear_temp_array"(value: number): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:167. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "country": CountryRef } | CwtNode): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:186. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "countries": readonly (CountryRef)[] } | CwtNode): boolean;
  /** - Example: *collection_size = { input = collection:my_awesome_collection value > 1 }* - Variables can be used - Multiple comparisons are allowed: value > x value < y - Supported operators: <, >, = (THIS IS NOT TRUE AS OF 1.17.0.7) - Comparison is inclusive, so "value > X" actually means "value >= X" CWT: Config/triggers_ncns.cwt:396. */
  "collection_size"(value: { "input": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "value": number } | CwtNode): boolean;
  /** Returns true if the specified number of sub-triggers return true. CWT: Config/triggers.cwt:1278. */
  "count_triggers"(value: CwtNode): boolean;
  /** Check if the specified country exist. CWT: Config/triggers.cwt:354. */
  "country_exists"(value: CountryRef): boolean;
  /**  CWT: Config/triggers_gtd.cwt:153. */
  "custom_override_tooltip"(value: CwtNode): boolean;
  /** Works as an and-trigger with a custom tooltip. CWT: Config/triggers.cwt:760. */
  "custom_trigger_tooltip"(value: CwtNode): boolean;
  /** Checks for a specific date. CWT: Config/triggers.cwt:619. */
  "date"(value: string): boolean;
  /** Evaluates a math expression and writes the numeric result to the tooltip. CWT: Config/triggers_taog.cwt:31. */
  "debug_math_expr"(value: CwtNode): boolean;
  /** Check if the difficulty is above or below specified value 0-2 (difficulty enum). Example: difficulty > 0 (above easy). CWT: Config/triggers.cwt:46. */
  "difficulty"(value: number): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:104. */
  "divide_temp_variable"(value: CwtNode): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:128. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:28. */
  "else"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:21. */
  "else_if"(value: CwtNode): boolean;
  /** check cost of equipment production line CWT: Config/triggers_gtd.cwt:108. */
  "equipment_cost"(value: CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/triggers.cwt:2006. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/triggers.cwt:1992. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Returns true if all of the active game rule options allow achievements. CWT: Config/triggers.cwt:1758. */
  "game_rules_allow_achievements"(value: true): boolean;
  /** Returns true if the game has any custom difficulty on. CWT: Config/triggers.cwt:1124. */
  "has_any_custom_difficulty_setting"(value: boolean): boolean;
  /** Returns true if the game has the specified custom difficulty on. CWT: Config/triggers.cwt:1120. */
  "has_custom_difficulty_setting"(value: string): boolean;
  /** Checks if player has a DLC. Example: has_dlc = "name of the dlc". CWT: Config/triggers.cwt:176. */
  "has_dlc"(value: string): boolean;
  /** Checks if current scope or global scope has the specified event target saved. CWT: Config/triggers.cwt:1570. */
  "has_event_target"(value: string): boolean;
  /** Checks if a game rule is set to a particular option. CWT: Config/triggers.cwt:1751. */
  "has_game_rule"(value: { "rule": string; "option": string } | CwtNode): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:155. */
  "has_global_flag"(value: string): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:160. */
  "has_global_flag"(value: { "flag": string; "value"?: number; "date"?: string; "days"?: number } | CwtNode): boolean;
  /** Check if flag has been set within the special project in scope. May checks on the value or date/days since last modified date. CWT: Config/triggers_gtd.cwt:26. */
  "has_project_flag"(value: string): boolean;
  /** Check if flag has been set within the special project in scope. May checks on the value or date/days since last modified date. CWT: Config/triggers_gtd.cwt:31. */
  "has_project_flag"(value: { "flag": string; "value"?: number; "date"?: string; "days"?: number } | CwtNode): boolean;
  /** Checks if a state contains a railway at or above the specified level. CWT: Config/triggers_nsb.cwt:29. */
  "has_railway_level"(value: { "level": number; "state": StateRef } | CwtNode): boolean;
  /** Compare the initial start date of current game. CWT: Config/triggers.cwt:615. */
  "has_start_date"(value: string): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1550. */
  "has_variable"(value: string): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1554. */
  "has_variable"(value: number): boolean;
  /** Trigger not shown in tooltips. CWT: Config/triggers.cwt:2114. */
  "hidden_trigger"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:14. */
  "if"(value: CwtNode): boolean;
  /** Checks if a the combatant or leader has a border war. CWT: Config/triggers.cwt:1586. */
  "is_border_war"(value: boolean): boolean;
  /** Returns true if game is in debug mode (launched with -debug argument). CWT: Config/triggers_new.cwt:86. */
  "is_debug"(value: boolean): boolean;
  /** Checks if scope leader is from an exiled government. is_exiled_leader = yes. CWT: Config/triggers.cwt:1681. */
  "is_exiled_leader"(value: true): boolean;
  /** Checks if scope leader is from specified exiled government. is_exiled_leader_from = FRA. CWT: Config/triggers.cwt:1700. */
  "is_exiled_leader_from"(value: CountryRef): boolean;
  /** Check if the historical focus is active. CWT: Config/triggers.cwt:992. */
  "is_historical_focus_on"(value: boolean): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1762. */
  "is_in_array"(value: { "array": string | CwtOpaque; "value": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1769. */
  "is_in_array"(value: CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1775. */
  "is_in_array"(value: { "variable_field_32": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Check if current game is ironman. CWT: Config/triggers.cwt:611. */
  "is_ironman"(value: boolean): boolean;
  /** Check if the tutorial is active. CWT: Config/triggers.cwt:988. */
  "is_tutorial"(value: boolean): boolean;
  /** All inside trigger must be true. At least one entry inside trigger must be true. Negates content of trigger. Print message to game.log - Can be localized. CWT: Config/triggers_new.cwt:15. */
  "log"(value: string): boolean;
  /** Meta triggers can be used for building triggers from strings and running them. following example will test if Germany has 42 pp. CWT: Config/triggers.cwt:1951. */
  "meta_trigger"(value: CwtNode): boolean;
  /** Modulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:161. */
  "modulo_temp_variable"(value: CwtNode): boolean;
  /** Mdulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:167. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:93. */
  "multiply_temp_variable"(value: CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:100. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /**  CWT: Config/scopes.cwt:34. */
  "NOT"(value: CwtNode): boolean;
  /**  CWT: Config/scopes.cwt:42. */
  "OR"(value: CwtNode): boolean;
  /** Compares the amount of turns that have passed during the peace conference with a number. CWT: Config/triggers_bba.cwt:175. */
  "pc_turn"(value: number): boolean;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/triggers.cwt:1635. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:143. */
  "randomize_temp_variable"(value: string): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:147. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1811. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1824. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1833. */
  "remove_from_temp_array"(value: CwtNode): boolean;
  /** Check amount of reserves. CWT: Config/triggers.cwt:76. */
  "reserves"(value: number): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1851. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1863. */
  "resize_temp_array"(value: CwtNode): boolean;
  /** Rounds a temporary variable. CWT: Config/variable_triggers_temp.cwt:200. */
  "round_temp_variable"(value: string): boolean;
  /** Check if the current scope exist. CWT: Config/triggers_gtd.cwt:104. */
  "scope_exists"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:1. */
  "scope_field"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:3. */
  "set_temp_variable"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:38. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:174. */
  "set_temp_variable_to_random"(value: string): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:178. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): boolean;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:82. */
  "subtract_from_temp_variable"(value: CwtNode): boolean;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_triggers_temp.cwt:89. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Check the global threat value. 0-1 value. CWT: Config/triggers.cwt:142. */
  "threat"(value: number): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:706. */
  "tooltip_evaluation"(value: "eval"): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:733. */
  "tooltip_evaluation"(value: "no_eval"): boolean;
}
export interface GeneratedCombatEffects {
  /** Add divisional commander xp to unit CWT: Config/effects_new.cwt:1018. */
  "add_divisional_commander_xp"(value: number): void;
  /** Adds the specified equipment bonuses to the country. As description the given loc key or the name of given special project will be used. Same usage as in Ideas/National spirits CWT: Config/effects_gtd.cwt:120. */
  "add_equipment_bonus"(value: { "name"?: string; "project"?: CwtOpaque; "bonus": CwtNode } | CwtNode): void;
  /** Adds new namespace. CWT: Config/effects.cwt:761. */
  "add_namespace"(value: string | number | boolean | CountryRef | StateRef): void;
  /** Add efficiency factor to strategic region for from country. CWT: Config/effects.cwt:2342. */
  "add_region_efficiency"(value: "replace_me"): void;
  /** Adds either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:154. */
  "add_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2824. */
  "add_to_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2846. */
  "add_to_array"(value: CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2943. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2965. */
  "add_to_temp_array"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:122. */
  "add_to_temp_variable"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:129. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:67. */
  "add_to_variable"(value: CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:71. */
  "add_to_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Adds victory point to province. CWT: Config/effects_new.cwt:957. */
  "add_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:51. */
  "AND"(value: CwtNode): void;
  /** Boost planning of units that are belongs to the army group/navy of this unit leader. CWT: Config/effects.cwt:2338. */
  "boost_planning"(value: number): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1372. */
  "break"(value: "none"): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1376. */
  "break"(value: true): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:844. */
  "build_railway"(value: { "path": readonly (number)[]; "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:878. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_province": number; "target_province": number; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:915. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_state": StateRef; "target_state": StateRef; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_effects_temp.cwt:242. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): void;
  /** Clamps a variable between two a values or another variables. CWT: Config/variable_effects.cwt:188. */
  "clamp_variable"(value: { "var": CwtOpaque; "min"?: number | string; "max"?: number | string } | CwtNode): void;
  /** Clears the contents of array. CWT: Config/effects.cwt:2907. */
  "clear_array"(value: string | CwtOpaque): void;
  /** Clear a global event target. CWT: Config/effects.cwt:1364. */
  "clear_global_event_target"(value: string): void;
  /** Clear all global event targets. CWT: Config/effects.cwt:1368. */
  "clear_global_event_targets"(value: true): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3016. */
  "clear_temp_array"(value: string): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3019. */
  "clear_temp_array"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:206. */
  "clear_variable"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:210. */
  "clear_variable"(value: CwtOpaque): void;
  /** Clear global flag. CWT: Config/effects.cwt:170. */
  "clr_global_flag"(value: string): void;
  /** Creates a dynamic country and runs child effects on it. CWT: Config/effects_new.cwt:327. */
  "create_dynamic_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Creates an enitity Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. For comparison, default minimum zoom level (closest to the map) is 50 units, while default maximum CWT: Config/effects_nsb.cwt:823. */
  "create_entity"(value: { "entity": string; "id"?: string; "var"?: string; "x"?: number; "y"?: number; "z"?: number; "province"?: number; "state"?: StateRef; "rotation": number; "scale": number; "min_zoom": number; "visible"?: string } | CwtNode): void;
  /** Creates a purchase contract between the countries CWT: Config/effects_aat.cwt:253. */
  "create_purchase_contract"(value: { "seller": CountryRef; "buyer": CountryRef; "civilian_factories": number; "equipment": { "type": string; "amount": number } | CwtNode } | CwtNode): void;
  /** Create railway gun effect CWT: Config/effects_nsb.cwt:713. */
  "create_railway_gun"(value: { "equipment": string; "name"?: string; "location"?: number } | CwtNode): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:14. */
  "custom_effect_tooltip"(value: string): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:17. */
  "custom_effect_tooltip"(value: CwtNode): void;
  /** Executes the provided effects but with a custom tooltip surpressing all tooltips from all other effects inside this block. The custom tooltip is a [bindable localization] CWT: Config/effects_gtd.cwt:318. */
  "custom_override_tooltip"(value: CwtNode): void;
  /** Destroys an existing entity IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:849. */
  "destroy_entity"(value: string): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:155. */
  "divide_temp_variable"(value: CwtNode): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:179. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:91. */
  "divide_variable"(value: CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:116. */
  "divide_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Shows just tooltip of effects. CWT: Config/effects.cwt:1510. */
  "effect_tooltip"(value: CwtNode): void;
  /** Use after (else_)if for a catch-all case. CWT: Config/effects.cwt:431. */
  "else"(value: CwtNode): void;
  /** Use after (else_)if to check other triggers only if first if fails. CWT: Config/effects.cwt:422. */
  "else_if"(value: CwtNode): void;
  /** Shows event option tooltip CWT: Config/effects.cwt:27. */
  "event_option_tooltip"(value: string): void;
  /** - Example *every_collection_element = { limit = { xxx } add_political_power = 1 } - Some collections, like 'country:faction_members', require country scope - Supports 'limit' trigger Applies arbitrary effects to all elements of a collection. Supports both anonymous and regular collections CWT: Config/effects_ncns.cwt:248. */
  "every_collection_element"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfills the "limit" trigger. CWT: Config/effects.cwt:205. */
  "every_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a all countries with original tag. tooltip=key can be defined to override tooltip title. CWT: Config/effects_new.cwt:445. */
  "every_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfils the "limit" trigger. Difference with every_country is that it includes countries not yet present on the map. tooltip=key can be defined to override tooltip title. CWT: Config/effects_nsb.cwt:599. */
  "every_possible_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1067. */
  "every_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/effects.cwt:3261. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/effects.cwt:3247. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array. CWT: Config/effects.cwt:3042. */
  "for_each_loop"(value: CwtNode): void;
  /** Runs a loop on for each element of an array and changes scope to current element in each iteration. CWT: Config/effects.cwt:3068. */
  "for_each_scope_loop"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Runs a same effects through a loop. example will run the effects for value_name = -3, 0, 3, 6, 9 and then terminate. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. Consider using for_each_loop instead. CWT: Config/effects.cwt:3175. */
  "for_loop_effect"(value: CwtNode): void;
  /** Executes children effects on army leaders for every country in the world that fulfills the "limit" trigger. Better to use every_army_leader if you know the country. CWT: Config/effects.cwt:2355. */
  "global_every_army_leader"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Goes to stated province. CWT: Config/effects.cwt:1690. */
  "goto_province"(value: number): void;
  /** Goes to stated state. CWT: Config/effects.cwt:1694. */
  "goto_state"(value: StateRef): void;
  /** Effect not shown in tooltips. CWT: Config/effects.cwt:3783. */
  "hidden_effect"(value: CwtNode): void;
  /** A conditional effect. CWT: Config/effects.cwt:413. */
  "if"(value: CwtNode): void;
  /** Print message to game.log - Can be localized. CWT: Config/effects.cwt:493. */
  "log"(value: string): void;
  /** Meta effects can be used for building effects from strings and running them. following example will give Germany 42 pp. CWT: Config/effects.cwt:3214. */
  "meta_effect"(value: CwtNode): void;
  /** Modify global flag. Only modifies if flag already exists. CWT: Config/effects.cwt:2071. */
  "modify_global_flag"(value: { "flag": string; "value"?: number; "days"?: number } | CwtNode): void;
  /** Modulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:213. */
  "modulo_temp_variable"(value: CwtNode): void;
  /** Mdulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:219. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:155. */
  "modulo_variable"(value: CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:161. */
  "modulo_variable"(value: { "var": CwtOpaque; "value": number } | CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:144. */
  "multiply_temp_variable"(value: CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:151. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:83. */
  "multiply_variable"(value: CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:87. */
  "multiply_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:44. */
  "NOT"(value: CwtNode): void;
  /**  CWT: Config/scopes.cwt:52. */
  "OR"(value: CwtNode): void;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/effects.cwt:2572. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): void;
  /** Promote the officer of the division to a general scope = unit CWT: Config/effects_gtd.cwt:298. */
  "promote_officer_to_general"(value: boolean): void;
  /** A possible random effect that can occur. CWT: Config/effects.cwt:343. */
  "random"(value: CwtNode): void;
  /** Executes children effects on random country that fulfills the "limit" trigger. CWT: Config/effects.cwt:211. */
  "random_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a random country with original tag. CWT: Config/effects_new.cwt:420. */
  "random_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** A list of possible random effects to trigger in this effect. CWT: Config/effects.cwt:355. */
  "random_list"(value: CwtNode): void;
  /** Runs the effect for a random element in array. CWT: Config/effects.cwt:3082. */
  "random_scope_in_array"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on random state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1049. */
  "random_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:194. */
  "randomize_temp_variable"(value: string): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:198. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:132. */
  "randomize_variable"(value: string): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:136. */
  "randomize_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number | string; "max"?: number | string; "lambda"?: number } | CwtNode): void;
  /** Randomize weather effect. CWT: Config/effects.cwt:570. */
  "randomize_weather"(value: number): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2869. */
  "remove_from_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2884. */
  "remove_from_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2894. */
  "remove_from_array"(value: CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2978. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2993. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:3003. */
  "remove_from_temp_array"(value: CwtNode): void;
  /** Removes either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:164. */
  "remove_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:123. */
  "remove_unit_leader_role"(value: string): void;
  /** Reset name of a province back to localization one. CWT: Config/effects.cwt:2120. */
  "reset_province_name"(value: number): void;
  /** Resizes array. CWT: Config/effects.cwt:2911. */
  "resize_array"(value: { "array": string; "value"?: number | string; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes array. CWT: Config/effects.cwt:2928. */
  "resize_array"(value: CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3023. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3035. */
  "resize_temp_array"(value: CwtNode): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:397. */
  "retire_character"(value: string): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:409. */
  "retire_character"(value: CwtOpaque): void;
  /** Rounds a temporary variable. CWT: Config/variable_effects_temp.cwt:252. */
  "round_temp_variable"(value: string): void;
  /** Rounds a variable. CWT: Config/variable_effects.cwt:202. */
  "round_variable"(value: CwtOpaque): void;
  /** Save an event target. CWT: Config/effects.cwt:1356. */
  "save_event_target_as"(value: string): void;
  /** Save a global event target. CWT: Config/effects.cwt:1360. */
  "save_global_event_target_as"(value: string): void;
  /**  CWT: Config/scopes.cwt:32. */
  "scope_field"(value: CwtNode): void;
  /** Sets the animation of a specified entity IDs are set by the create_entity effect. Animations are defined within the /Hearts of Iron IV/gfx/models/** /*.asset files. CWT: Config/effects_nsb.cwt:903. */
  "set_entity_animation"(value: { "id": string; "animation": string } | CwtNode): void;
  /** Sets the position and rotation of an entity using two coordinates. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:855. */
  "set_entity_movement"(value: { "id": string; "start": { "x": number; "y": number; "z"?: number } | CwtNode; "target": { "province": number } | CwtNode; "ratio": number; "rotation": number } | CwtNode): void;
  /** Sets the position of an existing entity. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. CWT: Config/effects_nsb.cwt:873. */
  "set_entity_position"(value: { "id": string; "x": number; "y": number; "z"?: number; "province": "enum"; "state": StateRef } | CwtNode): void;
  /** Sets the currently-facing angle of an existing entity. IDs are set by the create_entity effect. A positive change results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:887. */
  "set_entity_rotation"(value: { "id": string; "rotation": number } | CwtNode): void;
  /** Sets the size of an existing entity. IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:895. */
  "set_entity_scale"(value: { "id": string; "scale": number } | CwtNode): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:269. */
  "set_faction_military_unlocked"(value: boolean): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:265. */
  "set_faction_research_unlocked"(value: boolean): void;
  /** Set global flag. CWT: Config/effects.cwt:157. */
  "set_global_flag"(value: string): void;
  /** Set global flag. CWT: Config/effects.cwt:160. */
  "set_global_flag"(value: { "flag": string; "value": number; "days"?: number } | CwtNode): void;
  /** Set_province_name = { id = <province id> name = <string> } - Set name for a province. CWT: Config/effects.cwt:2109. */
  "set_province_name"(value: { "id": number; "name": string } | CwtNode): void;
  /** # TEMP VARIABLE Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:53. */
  "set_temp_variable"(value: CwtNode): void;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:88. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:226. */
  "set_temp_variable_to_random"(value: string): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:230. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:3. */
  "set_variable"(value: CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:37. */
  "set_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:168. */
  "set_variable_to_random"(value: string): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:172. */
  "set_variable_to_random"(value: { "var": string; "min"?: number | string; "max"?: number | string; "integer"?: boolean } | CwtNode): void;
  /** Sets victory point to province. CWT: Config/effects_new.cwt:964. */
  "set_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /** Plays sound effect. CWT: Config/effects.cwt:562. */
  "sound_effect"(value: string): void;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:133. */
  "subtract_from_temp_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_effects_temp.cwt:140. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:75. */
  "subtract_from_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:79. */
  "subtract_from_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Give supply to units being controlled by this leader. CWT: Config/effects.cwt:3291. */
  "supply_units"(value: number): void;
  /**  CWT: Config/effects.cwt:1381. */
  "unlock_national_focus"(value: string): void;
  /** Runs the effect as long as a trigger is true. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. CWT: Config/effects.cwt:3200. */
  "while_loop_effect"(value: CwtNode): void;
}
export interface GeneratedCombatTriggers {
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1781. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef; "index"?: "int_variable_field_32" } | CwtNode): boolean;
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1800. */
  "add_to_temp_array"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:71. */
  "add_to_temp_variable"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:78. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { all_collection_elements = { ``` Example (anonymous collection): Example: *all_collection_elements = { coll CWT: Config/triggers_ncns.cwt:151. */
  "all_collection_elements"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all countries meets the trigger. CWT: Config/triggers.cwt:223. */
  "all_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if all of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:507. */
  "all_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if all country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:195. */
  "all_country_with_original_tag"(value: CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1887. */
  "all_of"(value: CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1918. */
  "all_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all states meets the trigger. CWT: Config/triggers.cwt:525. */
  "all_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Always returns specified value. CWT: Config/triggers.cwt:146. */
  "always"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:41. */
  "AND"(value: CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { any_collection_element = { ``` Example (anonymous collection): Example: *any_collection_element = { collec CWT: Config/triggers_ncns.cwt:124. */
  "any_collection_element"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any country meets the trigger. CWT: Config/triggers.cwt:89. */
  "any_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:533. */
  "any_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:182. */
  "any_country_with_original_tag"(value: CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:552. */
  "any_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1871. */
  "any_of"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1908. */
  "any_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any other country meets the trigger. Excludes current country. CWT: Config/triggers.cwt:1095. */
  "any_other_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries (except for the current country) fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:571. */
  "any_other_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries and isn't the current country fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:590. */
  "any_other_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any state meets the trigger. CWT: Config/triggers.cwt:505. */
  "any_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** check if any state in the given category meets the trigger. CWT: Config/triggers_gtd.cwt:84. */
  "any_state_in"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Checks if any of the provided states fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:482. */
  "any_state_of"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Check that average armor level of combatant is over a certain level. CWT: Config/triggers.cwt:244. */
  "armor"(value: number): boolean;
  /** Compares attack skill level of a unit leader. CWT: Config/triggers.cwt:1611. */
  "attack_skill_level"(value: number): boolean;
  /** Compares the average stats for a unit leader. CWT: Config/triggers.cwt:1607. */
  "average_stats"(value: number): boolean;
  /** Check if leader can select a trait. CWT: Config/triggers.cwt:1562. */
  "can_select_trait"(value: string): boolean;
  /** Evaluates a math expression and returns true when the result is non-zero. CWT: Config/triggers_taog.cwt:57. */
  "check_expr"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:93. */
  "check_variable"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:105. */
  "check_variable"(value: { "var": string | number | boolean | CountryRef | StateRef; "value": string | number | boolean | CountryRef | StateRef; "compare"?: string; "tooltip"?: string } | CwtNode): boolean;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_triggers_temp.cwt:190. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1844. */
  "clear_temp_array"(value: string | CwtOpaque): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1847. */
  "clear_temp_array"(value: number): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:167. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "country": CountryRef } | CwtNode): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:186. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "countries": readonly (CountryRef)[] } | CwtNode): boolean;
  /** - Example: *collection_size = { input = collection:my_awesome_collection value > 1 }* - Variables can be used - Multiple comparisons are allowed: value > x value < y - Supported operators: <, >, = (THIS IS NOT TRUE AS OF 1.17.0.7) - Comparison is inclusive, so "value > X" actually means "value >= X" CWT: Config/triggers_ncns.cwt:396. */
  "collection_size"(value: { "input": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "value": number } | CwtNode): boolean;
  /** Returns true if the specified number of sub-triggers return true. CWT: Config/triggers.cwt:1278. */
  "count_triggers"(value: CwtNode): boolean;
  /** Check if the specified country exist. CWT: Config/triggers.cwt:354. */
  "country_exists"(value: CountryRef): boolean;
  /**  CWT: Config/triggers_gtd.cwt:153. */
  "custom_override_tooltip"(value: CwtNode): boolean;
  /** Works as an and-trigger with a custom tooltip. CWT: Config/triggers.cwt:760. */
  "custom_trigger_tooltip"(value: CwtNode): boolean;
  /** Checks for a specific date. CWT: Config/triggers.cwt:619. */
  "date"(value: string): boolean;
  /** Evaluates a math expression and writes the numeric result to the tooltip. CWT: Config/triggers_taog.cwt:31. */
  "debug_math_expr"(value: CwtNode): boolean;
  /** Compares defense skill level of a unit leader. CWT: Config/triggers.cwt:1615. */
  "defense_skill_level"(value: number): boolean;
  /** Check if the difficulty is above or below specified value 0-2 (difficulty enum). Example: difficulty > 0 (above easy). CWT: Config/triggers.cwt:46. */
  "difficulty"(value: number): boolean;
  /** Check if we have digin level (lowest). CWT: Config/triggers.cwt:236. */
  "dig_in"(value: number): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:104. */
  "divide_temp_variable"(value: CwtNode): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:128. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:28. */
  "else"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:21. */
  "else_if"(value: CwtNode): boolean;
  /** check cost of equipment production line CWT: Config/triggers_gtd.cwt:108. */
  "equipment_cost"(value: CwtNode): boolean;
  /** Check if fastest unit of combatant is over this limit. CWT: Config/triggers.cwt:595. */
  "fastest_unit"(value: number): boolean;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/triggers.cwt:2006. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/triggers.cwt:1992. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Check if sides front is full or can get more reinforcements. CWT: Config/triggers.cwt:687. */
  "frontage_full"(value: boolean): boolean;
  /** Returns true if all of the active game rule options allow achievements. CWT: Config/triggers.cwt:1758. */
  "game_rules_allow_achievements"(value: true): boolean;
  /** Check lowest/highest hardness level on combatant. CWT: Config/triggers.cwt:938. */
  "hardness"(value: number): boolean;
  /** Does unit leader have the abilityCheck if a unit leader has the ability. CWT: Config/triggers.cwt:1546. */
  "has_ability"(value: string): boolean;
  /** Returns true if the game has any custom difficulty on. CWT: Config/triggers.cwt:1124. */
  "has_any_custom_difficulty_setting"(value: boolean): boolean;
  /** Check that ratio of atrillery battalions in the composition of a side of combating troops are over a certain level. CWT: Config/triggers_gtd.cwt:136. */
  "has_artillery_ratio"(value: number): boolean;
  /** Check if carrier has airplanes that are part of the current combat. CWT: Config/triggers.cwt:1440. */
  "has_carrier_airwings_in_own_combat"(value: boolean): boolean;
  /** Check if side has a career with air wings on a mission. CWT: Config/triggers.cwt:867. */
  "has_carrier_airwings_on_mission"(value: boolean): boolean;
  /** Check that ratio of cavalry brigades in the composition of a side of combating troops are over a certain level. CWT: Config/triggers.cwt:1172. */
  "has_cavalry_ratio"(value: number): boolean;
  /** Check if combatant has modifier. CWT: Config/triggers.cwt:587. */
  "has_combat_modifier"(value: string): boolean;
  /** Returns true if the game has the specified custom difficulty on. CWT: Config/triggers.cwt:1120. */
  "has_custom_difficulty_setting"(value: string): boolean;
  /** Checks if player has a DLC. Example: has_dlc = "name of the dlc". CWT: Config/triggers.cwt:176. */
  "has_dlc"(value: string): boolean;
  /** Checks if current scope or global scope has the specified event target saved. CWT: Config/triggers.cwt:1570. */
  "has_event_target"(value: string): boolean;
  /** Check if side has flanked their opponent. CWT: Config/triggers.cwt:871. */
  "has_flanked_opponent"(value: boolean): boolean;
  /** Checks if a game rule is set to a particular option. CWT: Config/triggers.cwt:1751. */
  "has_game_rule"(value: { "rule": string; "option": string } | CwtNode): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:155. */
  "has_global_flag"(value: string): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:160. */
  "has_global_flag"(value: { "flag": string; "value"?: number; "date"?: string; "days"?: number } | CwtNode): boolean;
  /** Check unit leader has specified ID. Don't localize this. Tooltip only for debug. CWT: Config/triggers.cwt:1558. */
  "has_id"(value: number): boolean;
  /** Check if side has maximal planning bonus. CWT: Config/triggers.cwt:851. */
  "has_max_planning"(value: boolean): boolean;
  /** Checks if a state contains a railway at or above the specified level. CWT: Config/triggers_nsb.cwt:29. */
  "has_railway_level"(value: { "level": number; "state": StateRef } | CwtNode): boolean;
  /** Check if side has reserves waiting. CWT: Config/triggers.cwt:683. */
  "has_reserves"(value: boolean): boolean;
  /** Compare the initial start date of current game. CWT: Config/triggers.cwt:615. */
  "has_start_date"(value: string): boolean;
  /** Check if sides leader has trait. CWT: Config/triggers.cwt:671. */
  "has_trait"(value: string): boolean;
  /** Has unit leader flag been setCheck flag val date set and days since set. CWT: Config/triggers.cwt:1510. */
  "has_unit_leader_flag"(value: string): boolean;
  /** Has unit leader flag been setCheck flag val date set and days since set. CWT: Config/triggers.cwt:1514. */
  "has_unit_leader_flag"(value: { "flag": string; "value"?: number; "date"?: string; "days"?: number } | CwtNode): boolean;
  /** Check if the combatant has at least one of the provided unit types. CWT: Config/triggers_gtd.cwt:140. */
  "has_unit_type"(value: string): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1550. */
  "has_variable"(value: string): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1554. */
  "has_variable"(value: number): boolean;
  /** Trigger not shown in tooltips. CWT: Config/triggers.cwt:2114. */
  "hidden_trigger"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:14. */
  "if"(value: CwtNode): boolean;
  /** Checks if the current scope is performing an amphibious invasion. CWT: Config/triggers.cwt:839. */
  "is_amphibious_invasion"(value: boolean): boolean;
  /** Is_assigned = yes/no - Checks if the current unit leader is assigned to command an army/navy. CWT: Config/triggers.cwt:1498. */
  "is_assigned"(value: boolean): boolean;
  /** Check if attacker side in combat. CWT: Config/triggers.cwt:172. */
  "is_attacker"(value: boolean): boolean;
  /** Checks if a the combatant or leader has a border war. CWT: Config/triggers.cwt:1586. */
  "is_border_war"(value: boolean): boolean;
  /** Returns true if game is in debug mode (launched with -debug argument). CWT: Config/triggers_new.cwt:86. */
  "is_debug"(value: boolean): boolean;
  /** Check if defender side in combat. CWT: Config/triggers.cwt:583. */
  "is_defender"(value: boolean): boolean;
  /** Checks if scope leader is from an exiled government. is_exiled_leader = yes. CWT: Config/triggers.cwt:1681. */
  "is_exiled_leader"(value: true): boolean;
  /** Checks if scope leader is from specified exiled government. is_exiled_leader_from = FRA. CWT: Config/triggers.cwt:1700. */
  "is_exiled_leader_from"(value: CountryRef): boolean;
  /** Is_field_marshal = yes/no - Checks if the current unit leader is a field marshall. CWT: Config/triggers.cwt:1506. */
  "is_field_marshal"(value: boolean): boolean;
  /** Check if side is fighting air units. CWT: Config/triggers.cwt:863. */
  "is_fighting_air_units"(value: boolean): boolean;
  /** Check what terrain is in combat. CWT: Config/triggers.cwt:579. */
  "is_fighting_in_terrain"(value: string): boolean;
  /** Checks the weather on a combat. CWT: Config/triggers.cwt:2090. */
  "is_fighting_in_weather"(value: string | number | boolean | CountryRef | StateRef): boolean;
  /** Check if the historical focus is active. CWT: Config/triggers.cwt:992. */
  "is_historical_focus_on"(value: boolean): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1762. */
  "is_in_array"(value: { "array": string | CwtOpaque; "value": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1769. */
  "is_in_array"(value: CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1775. */
  "is_in_array"(value: { "variable_field_32": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Check if current game is ironman. CWT: Config/triggers.cwt:611. */
  "is_ironman"(value: boolean): boolean;
  /** Is_leading_army = yes/no - Checks if the current unit leader is leading a single army (not army group). CWT: Config/triggers.cwt:1631. */
  "is_leading_army"(value: boolean): boolean;
  /** Is_leading_army_group = yes/no - Checks if the current unit leader is leading an army group (not single army). CWT: Config/triggers.cwt:1627. */
  "is_leading_army_group"(value: boolean): boolean;
  /** Check if the tutorial is active. CWT: Config/triggers.cwt:988. */
  "is_tutorial"(value: boolean): boolean;
  /** Check if defender side in combat. CWT: Config/triggers.cwt:591. */
  "is_winning"(value: boolean): boolean;
  /** Check if side has more combat width than their opponent. CWT: Config/triggers.cwt:859. */
  "less_combat_width_than_opponent"(value: boolean): boolean;
  /** All inside trigger must be true. At least one entry inside trigger must be true. Negates content of trigger. Print message to game.log - Can be localized. CWT: Config/triggers_new.cwt:15. */
  "log"(value: string): boolean;
  /** Compares logistics skill level of a unit leader. CWT: Config/triggers.cwt:1619. */
  "logistics_skill_level"(value: number): boolean;
  /** Meta triggers can be used for building triggers from strings and running them. following example will test if Germany has 42 pp. CWT: Config/triggers.cwt:1951. */
  "meta_trigger"(value: CwtNode): boolean;
  /** Check if side has maximal planning bonus. CWT: Config/triggers.cwt:1220. */
  "min_planning"(value: number): boolean;
  /** Modulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:161. */
  "modulo_temp_variable"(value: CwtNode): boolean;
  /** Mdulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:167. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:93. */
  "multiply_temp_variable"(value: CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:100. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Check if combat is at night. CWT: Config/triggers.cwt:232. */
  "night"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:34. */
  "NOT"(value: CwtNode): boolean;
  /** Check number of units commanded by the unit leader. CWT: Config/triggers.cwt:1502. */
  "num_units"(value: number): boolean;
  /** Changes scope to opposing army/navy. CWT: Config/triggers.cwt:2106. */
  "opponent"(value: CwtNode): boolean;
  /**  CWT: Config/scopes.cwt:42. */
  "OR"(value: CwtNode): boolean;
  /** Checks if the current scope was ever the specified country. CWT: Config/triggers.cwt:891. */
  "original_tag"(value: CountryRef): boolean;
  /** Compares the amount of turns that have passed during the peace conference with a number. CWT: Config/triggers_bba.cwt:175. */
  "pc_turn"(value: number): boolean;
  /** Check if we are in this combat phase. CWT: Config/triggers.cwt:38. */
  "phase"(value: string): boolean;
  /** Compares planning skill level of a unit leader. CWT: Config/triggers.cwt:1623. */
  "planning_skill_level"(value: number): boolean;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/triggers.cwt:1635. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): boolean;
  /** Check if the victory points of the combatants province is larger or less than the provinded amount. CWT: Config/triggers_gtd.cwt:144. */
  "province_vp"(value: number): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:143. */
  "randomize_temp_variable"(value: string): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:147. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): boolean;
  /** Checks if side has an advantage in recon level. CWT: Config/triggers.cwt:599. */
  "recon_advantage"(value: boolean): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1811. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1824. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1833. */
  "remove_from_temp_array"(value: CwtNode): boolean;
  /** Check amount of reserves. CWT: Config/triggers.cwt:76. */
  "reserves"(value: number): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1851. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1863. */
  "resize_temp_array"(value: CwtNode): boolean;
  /** Rounds a temporary variable. CWT: Config/variable_triggers_temp.cwt:200. */
  "round_temp_variable"(value: string): boolean;
  /** Check if the current scope exist. CWT: Config/triggers_gtd.cwt:104. */
  "scope_exists"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:1. */
  "scope_field"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:3. */
  "set_temp_variable"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:38. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:174. */
  "set_temp_variable_to_random"(value: string): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:178. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): boolean;
  /** Compare leader skill levels. CWT: Config/triggers.cwt:34. */
  "skill"(value: number): boolean;
  /** Compare leader skill levels. CWT: Config/triggers.cwt:268. */
  "skill_advantage"(value: number): boolean;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:82. */
  "subtract_from_temp_variable"(value: CwtNode): boolean;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_triggers_temp.cwt:89. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Country tag trigger. CWT: Config/triggers.cwt:80. */
  "tag"(value: CountryRef): boolean;
  /** Check combat province temperature. CWT: Config/triggers.cwt:240. */
  "temperature"(value: number): boolean;
  /** Check the global threat value. 0-1 value. CWT: Config/triggers.cwt:142. */
  "threat"(value: number): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:706. */
  "tooltip_evaluation"(value: "eval"): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:733. */
  "tooltip_evaluation"(value: "no_eval"): boolean;
}
export interface GeneratedMilitaryIndustrialOrganizationEffects {
  /** Add divisional commander xp to unit CWT: Config/effects_new.cwt:1018. */
  "add_divisional_commander_xp"(value: number): void;
  /** Adds the specified equipment bonuses to the country. As description the given loc key or the name of given special project will be used. Same usage as in Ideas/National spirits CWT: Config/effects_gtd.cwt:120. */
  "add_equipment_bonus"(value: { "name"?: string; "project"?: CwtOpaque; "bonus": CwtNode } | CwtNode): void;
  /** Add percentage to the daily PP cost to assign to research in the military industrial organization in scope. This changes the base value. Modifiers will still apply over it. Value can be negative to reduce assign cost but final value cannot be negative (capped at 0, no error raised). 0.1 - 10% increa CWT: Config/effects_aat.cwt:52. */
  "add_mio_design_team_assign_cost"(value: number): void;
  /** Add percentage to the XP cost to change MIO in equipment designer for the military industrial organization in scope. This changes the base value. Modifiers will still apply over it. Value can be negative to reduce assign cost but final value cannot be negative (capped at 0, no error raised). !!! NOT CWT: Config/effects_aat.cwt:68. */
  "add_mio_design_team_change_cost"(value: number): void;
  /** Add funds to the military industrial organization in scope. Value can be negative to substract funds.If the new total funds go over the Size Up limit, the MIO will gain size(s). If the new total funds is negative, it will be capped at 0 without retracting size. Default Level 1 -> Level 2 to costs 1k CWT: Config/effects_aat.cwt:76. */
  "add_mio_funds"(value: number): void;
  /** Add to the factor applied when gaining funds in the military industrial organization in scope. This changes the base value. Modifiers will still apply over it. Value can be negative to reduce assign cost but final value cannot be negative (capped at 0, no error raised) CWT: Config/effects_aat.cwt:24. */
  "add_mio_funds_gain_factor"(value: number): void;
  /** Add percentage to the daily PP cost to assign to production line in the military industrial organization in scope. This changes the base value. Modifiers will still apply over it. Value can be negative to reduce assign cost but final value cannot be negative (capped at 0, no error raised). 0.1 - 10% CWT: Config/effects_aat.cwt:60. */
  "add_mio_industrial_manufacturer_assign_cost"(value: number): void;
  /** Add to the research bonus in the military industrial organization in scope. This changes the base value. Modifiers will still apply over it. Value can be negative to reduce research bonus but final research bonus cannot be negative (capped at 0, no error raised) CWT: Config/effects_aat.cwt:32. */
  "add_mio_research_bonus"(value: number): void;
  /** Add size levels to the military industrial organization in scope. Input value cannot be negative. The MIO will keep the same amount of funds it had before the effect CWT: Config/effects_aat.cwt:28. */
  "add_mio_size"(value: number): void;
  /** Add to the factor applied to funds required to size up in the military industrial organization in scope. This changes the base value. Modifiers will still apply over it. Value can be negative to reduce assign cost but final value cannot be negative (capped at 0, no error raised) CWT: Config/effects_aat.cwt:88. */
  "add_mio_size_up_requirement_factor"(value: number): void;
  /** Add to the maximum task capacity in the military industrial organization in scope. This changes the base value. Modifiers will still apply over it. Value can be negative to reduce capacity, but final capacity cannot be negative (capped at 0, no error raised). If the capacity is reduced and the MIO b CWT: Config/effects_aat.cwt:231. */
  "add_mio_task_capacity"(value: number): void;
  /** Adds new namespace. CWT: Config/effects.cwt:761. */
  "add_namespace"(value: string | number | boolean | CountryRef | StateRef): void;
  /** Add efficiency factor to strategic region for from country. CWT: Config/effects.cwt:2342. */
  "add_region_efficiency"(value: "replace_me"): void;
  /** Adds either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:154. */
  "add_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2824. */
  "add_to_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2846. */
  "add_to_array"(value: CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2943. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2965. */
  "add_to_temp_array"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:122. */
  "add_to_temp_variable"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:129. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:67. */
  "add_to_variable"(value: CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:71. */
  "add_to_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Adds victory point to province. CWT: Config/effects_new.cwt:957. */
  "add_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:51. */
  "AND"(value: CwtNode): void;
  /** Boost planning of units that are belongs to the army group/navy of this unit leader. CWT: Config/effects.cwt:2338. */
  "boost_planning"(value: number): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1372. */
  "break"(value: "none"): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1376. */
  "break"(value: true): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:844. */
  "build_railway"(value: { "path": readonly (number)[]; "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:878. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_province": number; "target_province": number; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:915. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_state": StateRef; "target_state": StateRef; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_effects_temp.cwt:242. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): void;
  /** Clamps a variable between two a values or another variables. CWT: Config/variable_effects.cwt:188. */
  "clamp_variable"(value: { "var": CwtOpaque; "min"?: number | string; "max"?: number | string } | CwtNode): void;
  /** Clears the contents of array. CWT: Config/effects.cwt:2907. */
  "clear_array"(value: string | CwtOpaque): void;
  /** Clear a global event target. CWT: Config/effects.cwt:1364. */
  "clear_global_event_target"(value: string): void;
  /** Clear all global event targets. CWT: Config/effects.cwt:1368. */
  "clear_global_event_targets"(value: true): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3016. */
  "clear_temp_array"(value: string): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3019. */
  "clear_temp_array"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:206. */
  "clear_variable"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:210. */
  "clear_variable"(value: CwtOpaque): void;
  /** Clear global flag. CWT: Config/effects.cwt:170. */
  "clr_global_flag"(value: string): void;
  /** Clear the matching flag in the military industrial organization in scope CWT: Config/effects_aat.cwt:219. */
  "clr_mio_flag"(value: string): void;
  /** Complete a trait in the military industrial organization in scope. This effect will not take into account the current state of the trait tree and will allow you to unlock a trait even if the one before is not unlocked. Will also add 1 size to the MIO so that size and numbers of unlocked traits are a CWT: Config/effects_aat.cwt:36. */
  "complete_mio_trait"(value: string): void;
  /** Complete a trait in the military industrial organization in scope. This effect will not take into account the current state of the trait tree and will allow you to unlock a trait even if the one before is not unlocked. Will also add 1 size to the MIO so that size and numbers of unlocked traits are a CWT: Config/effects_aat.cwt:40. */
  "complete_mio_trait"(value: { "trait": string; "show_modifiers"?: true | false } | CwtNode): void;
  /** Creates a dynamic country and runs child effects on it. CWT: Config/effects_new.cwt:327. */
  "create_dynamic_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Creates an enitity Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. For comparison, default minimum zoom level (closest to the map) is 50 units, while default maximum CWT: Config/effects_nsb.cwt:823. */
  "create_entity"(value: { "entity": string; "id"?: string; "var"?: string; "x"?: number; "y"?: number; "z"?: number; "province"?: number; "state"?: StateRef; "rotation": number; "scale": number; "min_zoom": number; "visible"?: string } | CwtNode): void;
  /** Creates a purchase contract between the countries CWT: Config/effects_aat.cwt:253. */
  "create_purchase_contract"(value: { "seller": CountryRef; "buyer": CountryRef; "civilian_factories": number; "equipment": { "type": string; "amount": number } | CwtNode } | CwtNode): void;
  /** Create railway gun effect CWT: Config/effects_nsb.cwt:713. */
  "create_railway_gun"(value: { "equipment": string; "name"?: string; "location"?: number } | CwtNode): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:14. */
  "custom_effect_tooltip"(value: string): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:17. */
  "custom_effect_tooltip"(value: CwtNode): void;
  /** Executes the provided effects but with a custom tooltip surpressing all tooltips from all other effects inside this block. The custom tooltip is a [bindable localization] CWT: Config/effects_gtd.cwt:318. */
  "custom_override_tooltip"(value: CwtNode): void;
  /** Destroys an existing entity IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:849. */
  "destroy_entity"(value: string): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:155. */
  "divide_temp_variable"(value: CwtNode): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:179. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:91. */
  "divide_variable"(value: CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:116. */
  "divide_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Shows just tooltip of effects. CWT: Config/effects.cwt:1510. */
  "effect_tooltip"(value: CwtNode): void;
  /** Use after (else_)if for a catch-all case. CWT: Config/effects.cwt:431. */
  "else"(value: CwtNode): void;
  /** Use after (else_)if to check other triggers only if first if fails. CWT: Config/effects.cwt:422. */
  "else_if"(value: CwtNode): void;
  /** Shows event option tooltip CWT: Config/effects.cwt:27. */
  "event_option_tooltip"(value: string): void;
  /** - Example *every_collection_element = { limit = { xxx } add_political_power = 1 } - Some collections, like 'country:faction_members', require country scope - Supports 'limit' trigger Applies arbitrary effects to all elements of a collection. Supports both anonymous and regular collections CWT: Config/effects_ncns.cwt:248. */
  "every_collection_element"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfills the "limit" trigger. CWT: Config/effects.cwt:205. */
  "every_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a all countries with original tag. tooltip=key can be defined to override tooltip title. CWT: Config/effects_new.cwt:445. */
  "every_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfils the "limit" trigger. Difference with every_country is that it includes countries not yet present on the map. tooltip=key can be defined to override tooltip title. CWT: Config/effects_nsb.cwt:599. */
  "every_possible_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1067. */
  "every_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/effects.cwt:3261. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/effects.cwt:3247. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array. CWT: Config/effects.cwt:3042. */
  "for_each_loop"(value: CwtNode): void;
  /** Runs a loop on for each element of an array and changes scope to current element in each iteration. CWT: Config/effects.cwt:3068. */
  "for_each_scope_loop"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Runs a same effects through a loop. example will run the effects for value_name = -3, 0, 3, 6, 9 and then terminate. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. Consider using for_each_loop instead. CWT: Config/effects.cwt:3175. */
  "for_loop_effect"(value: CwtNode): void;
  /** Executes children effects on army leaders for every country in the world that fulfills the "limit" trigger. Better to use every_army_leader if you know the country. CWT: Config/effects.cwt:2355. */
  "global_every_army_leader"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Goes to stated province. CWT: Config/effects.cwt:1690. */
  "goto_province"(value: number): void;
  /** Goes to stated state. CWT: Config/effects.cwt:1694. */
  "goto_state"(value: StateRef): void;
  /** Effect not shown in tooltips. CWT: Config/effects.cwt:3783. */
  "hidden_effect"(value: CwtNode): void;
  /** A conditional effect. CWT: Config/effects.cwt:413. */
  "if"(value: CwtNode): void;
  /** Print message to game.log - Can be localized. CWT: Config/effects.cwt:493. */
  "log"(value: string): void;
  /** Meta effects can be used for building effects from strings and running them. following example will give Germany 42 pp. CWT: Config/effects.cwt:3214. */
  "meta_effect"(value: CwtNode): void;
  /** Modify global flag. Only modifies if flag already exists. CWT: Config/effects.cwt:2071. */
  "modify_global_flag"(value: { "flag": string; "value"?: number; "days"?: number } | CwtNode): void;
  /** Modify the matching flag in the military industrial organization in scope. Happens only if the flag already exists CWT: Config/effects_aat.cwt:207. */
  "modify_mio_flag"(value: { "flag": string; "value"?: number; "days"?: number } | CwtNode): void;
  /** Modulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:213. */
  "modulo_temp_variable"(value: CwtNode): void;
  /** Mdulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:219. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:155. */
  "modulo_variable"(value: CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:161. */
  "modulo_variable"(value: { "var": CwtOpaque; "value": number } | CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:144. */
  "multiply_temp_variable"(value: CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:151. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:83. */
  "multiply_variable"(value: CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:87. */
  "multiply_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:44. */
  "NOT"(value: CwtNode): void;
  /**  CWT: Config/scopes.cwt:52. */
  "OR"(value: CwtNode): void;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/effects.cwt:2572. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): void;
  /** Promote the officer of the division to a general scope = unit CWT: Config/effects_gtd.cwt:298. */
  "promote_officer_to_general"(value: boolean): void;
  /** A possible random effect that can occur. CWT: Config/effects.cwt:343. */
  "random"(value: CwtNode): void;
  /** Executes children effects on random country that fulfills the "limit" trigger. CWT: Config/effects.cwt:211. */
  "random_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a random country with original tag. CWT: Config/effects_new.cwt:420. */
  "random_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** A list of possible random effects to trigger in this effect. CWT: Config/effects.cwt:355. */
  "random_list"(value: CwtNode): void;
  /** Runs the effect for a random element in array. CWT: Config/effects.cwt:3082. */
  "random_scope_in_array"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on random state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1049. */
  "random_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:194. */
  "randomize_temp_variable"(value: string): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:198. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:132. */
  "randomize_variable"(value: string): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:136. */
  "randomize_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number | string; "max"?: number | string; "lambda"?: number } | CwtNode): void;
  /** Randomize weather effect. CWT: Config/effects.cwt:570. */
  "randomize_weather"(value: number): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2869. */
  "remove_from_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2884. */
  "remove_from_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2894. */
  "remove_from_array"(value: CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2978. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2993. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:3003. */
  "remove_from_temp_array"(value: CwtNode): void;
  /** Removes either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:164. */
  "remove_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:123. */
  "remove_unit_leader_role"(value: string): void;
  /** Reset name of a province back to localization one. CWT: Config/effects.cwt:2120. */
  "reset_province_name"(value: number): void;
  /** Resizes array. CWT: Config/effects.cwt:2911. */
  "resize_array"(value: { "array": string; "value"?: number | string; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes array. CWT: Config/effects.cwt:2928. */
  "resize_array"(value: CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3023. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3035. */
  "resize_temp_array"(value: CwtNode): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:397. */
  "retire_character"(value: string): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:409. */
  "retire_character"(value: CwtOpaque): void;
  /** Rounds a temporary variable. CWT: Config/variable_effects_temp.cwt:252. */
  "round_temp_variable"(value: string): void;
  /** Rounds a variable. CWT: Config/variable_effects.cwt:202. */
  "round_variable"(value: CwtOpaque): void;
  /** Save an event target. CWT: Config/effects.cwt:1356. */
  "save_event_target_as"(value: string): void;
  /** Save a global event target. CWT: Config/effects.cwt:1360. */
  "save_global_event_target_as"(value: string): void;
  /**  CWT: Config/scopes.cwt:32. */
  "scope_field"(value: CwtNode): void;
  /** Sets the animation of a specified entity IDs are set by the create_entity effect. Animations are defined within the /Hearts of Iron IV/gfx/models/** /*.asset files. CWT: Config/effects_nsb.cwt:903. */
  "set_entity_animation"(value: { "id": string; "animation": string } | CwtNode): void;
  /** Sets the position and rotation of an entity using two coordinates. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:855. */
  "set_entity_movement"(value: { "id": string; "start": { "x": number; "y": number; "z"?: number } | CwtNode; "target": { "province": number } | CwtNode; "ratio": number; "rotation": number } | CwtNode): void;
  /** Sets the position of an existing entity. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. CWT: Config/effects_nsb.cwt:873. */
  "set_entity_position"(value: { "id": string; "x": number; "y": number; "z"?: number; "province": "enum"; "state": StateRef } | CwtNode): void;
  /** Sets the currently-facing angle of an existing entity. IDs are set by the create_entity effect. A positive change results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:887. */
  "set_entity_rotation"(value: { "id": string; "rotation": number } | CwtNode): void;
  /** Sets the size of an existing entity. IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:895. */
  "set_entity_scale"(value: { "id": string; "scale": number } | CwtNode): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:269. */
  "set_faction_military_unlocked"(value: boolean): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:265. */
  "set_faction_research_unlocked"(value: boolean): void;
  /** Set global flag. CWT: Config/effects.cwt:157. */
  "set_global_flag"(value: string): void;
  /** Set global flag. CWT: Config/effects.cwt:160. */
  "set_global_flag"(value: { "flag": string; "value": number; "days"?: number } | CwtNode): void;
  /** Set the daily PP cost to assign to research in the military industrial organization in scope.This changes the base value. Modifiers will still apply over it. Input value cannot be negative CWT: Config/effects_aat.cwt:56. */
  "set_mio_design_team_assign_cost"(value: number): void;
  /** Set the XP cost to change MIO in equipment designer for the military industrial organization in scope. This changes the base value. Modifiers will still apply over it. Input value cannot be negative CWT: Config/effects_aat.cwt:72. */
  "set_mio_design_team_change_cost"(value: number): void;
  /** Set flag in the military industrial organization in scope CWT: Config/effects_aat.cwt:193. */
  "set_mio_flag"(value: string): void;
  /** Set flag in the military industrial organization in scope CWT: Config/effects_aat.cwt:197. */
  "set_mio_flag"(value: { "flag": string; "value": number; "days"?: number } | CwtNode): void;
  /** Set the amount of funds for the military industrial organization in scope. Input value cannot be negative. If the new total funds go over the Size Up limit, the MIO will gain size(s) CWT: Config/effects_aat.cwt:80. */
  "set_mio_funds"(value: number): void;
  /** Set the factor applied when gaining funds in the military industrial organization in scope. This changes the base value. Modifiers will still apply over it. Input value cannot be negative. Base - 1? CWT: Config/effects_aat.cwt:84. */
  "set_mio_funds_gain_factor"(value: number): void;
  /** Set the icon GFX for the military industrial organization in scope CWT: Config/effects_aat.cwt:189. */
  "set_mio_icon"(value: string): void;
  /** Set the daily PP cost to assign to production line in the military industrial organization in scope. This changes the base value. Modifiers will still apply over it. Input value cannot be negative CWT: Config/effects_aat.cwt:64. */
  "set_mio_industrial_manufacturer_assign_cost"(value: number): void;
  /** Set the localisation key used to generate the name of the military industrial organization in scope. The localisation key may be a scripted localisation (triggers evaluated in MIO scope) CWT: Config/effects_aat.cwt:181. */
  "set_mio_name_key"(value: string): void;
  /** Set the research bonus in the military industrial organization in scope. This changes the base value. Modifiers will still apply over it. Input value cannot be negative CWT: Config/effects_aat.cwt:223. */
  "set_mio_research_bonus"(value: number): void;
  /** Set to the factor applied to funds required to size up in the military industrial organization in scope. This changes the base value. Modifiers will still apply over it. Input value cannot be negative CWT: Config/effects_aat.cwt:92. */
  "set_mio_size_up_requirement_factor"(value: number): void;
  /** Set the maximum task capacity in the military industrial organization in scope. This changes the base value. Modifiers will still apply over it. Input value cannot be negative. If the capacity is reduced and the MIO becomes over-assigned, the current tasks will be allowed. It's only later that the p CWT: Config/effects_aat.cwt:227. */
  "set_mio_task_capacity"(value: number): void;
  /** Set_province_name = { id = <province id> name = <string> } - Set name for a province. CWT: Config/effects.cwt:2109. */
  "set_province_name"(value: { "id": number; "name": string } | CwtNode): void;
  /** # TEMP VARIABLE Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:53. */
  "set_temp_variable"(value: CwtNode): void;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:88. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:226. */
  "set_temp_variable_to_random"(value: string): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:230. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:3. */
  "set_variable"(value: CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:37. */
  "set_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:168. */
  "set_variable_to_random"(value: string): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:172. */
  "set_variable_to_random"(value: { "var": string; "min"?: number | string; "max"?: number | string; "integer"?: boolean } | CwtNode): void;
  /** Sets victory point to province. CWT: Config/effects_new.cwt:964. */
  "set_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /** Plays sound effect. CWT: Config/effects.cwt:562. */
  "sound_effect"(value: string): void;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:133. */
  "subtract_from_temp_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_effects_temp.cwt:140. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:75. */
  "subtract_from_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:79. */
  "subtract_from_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Display a tooltip saying the trait is made available (aka unlocked) CWT: Config/effects_aat.cwt:8. */
  "unlock_mio_trait_tooltip"(value: string): void;
  /** Display a tooltip saying the trait is made available (aka unlocked) CWT: Config/effects_aat.cwt:12. */
  "unlock_mio_trait_tooltip"(value: { "trait": string; "show_modifiers"?: true | false } | CwtNode): void;
  /**  CWT: Config/effects.cwt:1381. */
  "unlock_national_focus"(value: string): void;
  /** Runs the effect as long as a trigger is true. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. CWT: Config/effects.cwt:3200. */
  "while_loop_effect"(value: CwtNode): void;
}
export interface GeneratedMilitaryIndustrialOrganizationTriggers {
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1781. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef; "index"?: "int_variable_field_32" } | CwtNode): boolean;
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1800. */
  "add_to_temp_array"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:71. */
  "add_to_temp_variable"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:78. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { all_collection_elements = { ``` Example (anonymous collection): Example: *all_collection_elements = { coll CWT: Config/triggers_ncns.cwt:151. */
  "all_collection_elements"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all countries meets the trigger. CWT: Config/triggers.cwt:223. */
  "all_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if all of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:507. */
  "all_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if all country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:195. */
  "all_country_with_original_tag"(value: CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1887. */
  "all_of"(value: CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1918. */
  "all_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all states meets the trigger. CWT: Config/triggers.cwt:525. */
  "all_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Always returns specified value. CWT: Config/triggers.cwt:146. */
  "always"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:41. */
  "AND"(value: CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { any_collection_element = { ``` Example (anonymous collection): Example: *any_collection_element = { collec CWT: Config/triggers_ncns.cwt:124. */
  "any_collection_element"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any country meets the trigger. CWT: Config/triggers.cwt:89. */
  "any_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:533. */
  "any_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:182. */
  "any_country_with_original_tag"(value: CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:552. */
  "any_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1871. */
  "any_of"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1908. */
  "any_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any other country meets the trigger. Excludes current country. CWT: Config/triggers.cwt:1095. */
  "any_other_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries (except for the current country) fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:571. */
  "any_other_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries and isn't the current country fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:590. */
  "any_other_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any state meets the trigger. CWT: Config/triggers.cwt:505. */
  "any_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** check if any state in the given category meets the trigger. CWT: Config/triggers_gtd.cwt:84. */
  "any_state_in"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Checks if any of the provided states fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:482. */
  "any_state_of"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Evaluates a math expression and returns true when the result is non-zero. CWT: Config/triggers_taog.cwt:57. */
  "check_expr"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:93. */
  "check_variable"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:105. */
  "check_variable"(value: { "var": string | number | boolean | CountryRef | StateRef; "value": string | number | boolean | CountryRef | StateRef; "compare"?: string; "tooltip"?: string } | CwtNode): boolean;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_triggers_temp.cwt:190. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1844. */
  "clear_temp_array"(value: string | CwtOpaque): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1847. */
  "clear_temp_array"(value: number): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:167. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "country": CountryRef } | CwtNode): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:186. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "countries": readonly (CountryRef)[] } | CwtNode): boolean;
  /** - Example: *collection_size = { input = collection:my_awesome_collection value > 1 }* - Variables can be used - Multiple comparisons are allowed: value > x value < y - Supported operators: <, >, = (THIS IS NOT TRUE AS OF 1.17.0.7) - Comparison is inclusive, so "value > X" actually means "value >= X" CWT: Config/triggers_ncns.cwt:396. */
  "collection_size"(value: { "input": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "value": number } | CwtNode): boolean;
  /** Returns true if the specified number of sub-triggers return true. CWT: Config/triggers.cwt:1278. */
  "count_triggers"(value: CwtNode): boolean;
  /** Check if the specified country exist. CWT: Config/triggers.cwt:354. */
  "country_exists"(value: CountryRef): boolean;
  /**  CWT: Config/triggers_gtd.cwt:153. */
  "custom_override_tooltip"(value: CwtNode): boolean;
  /** Works as an and-trigger with a custom tooltip. CWT: Config/triggers.cwt:760. */
  "custom_trigger_tooltip"(value: CwtNode): boolean;
  /** Checks for a specific date. CWT: Config/triggers.cwt:619. */
  "date"(value: string): boolean;
  /** Evaluates a math expression and writes the numeric result to the tooltip. CWT: Config/triggers_taog.cwt:31. */
  "debug_math_expr"(value: CwtNode): boolean;
  /** Check if the difficulty is above or below specified value 0-2 (difficulty enum). Example: difficulty > 0 (above easy). CWT: Config/triggers.cwt:46. */
  "difficulty"(value: number): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:104. */
  "divide_temp_variable"(value: CwtNode): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:128. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:28. */
  "else"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:21. */
  "else_if"(value: CwtNode): boolean;
  /** check cost of equipment production line CWT: Config/triggers_gtd.cwt:108. */
  "equipment_cost"(value: CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/triggers.cwt:2006. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/triggers.cwt:1992. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Returns true if all of the active game rule options allow achievements. CWT: Config/triggers.cwt:1758. */
  "game_rules_allow_achievements"(value: true): boolean;
  /** Returns true if the game has any custom difficulty on. CWT: Config/triggers.cwt:1124. */
  "has_any_custom_difficulty_setting"(value: boolean): boolean;
  /** Returns true if the game has the specified custom difficulty on. CWT: Config/triggers.cwt:1120. */
  "has_custom_difficulty_setting"(value: string): boolean;
  /** Checks if player has a DLC. Example: has_dlc = "name of the dlc". CWT: Config/triggers.cwt:176. */
  "has_dlc"(value: string): boolean;
  /** Checks if current scope or global scope has the specified event target saved. CWT: Config/triggers.cwt:1570. */
  "has_event_target"(value: string): boolean;
  /** Checks if a game rule is set to a particular option. CWT: Config/triggers.cwt:1751. */
  "has_game_rule"(value: { "rule": string; "option": string } | CwtNode): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:155. */
  "has_global_flag"(value: string): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:160. */
  "has_global_flag"(value: { "flag": string; "value"?: number; "date"?: string; "days"?: number } | CwtNode): boolean;
  /** Checks if the Military Industrial Organisation in scope has the input equipment type (possible values can be found in script_enum_equipment_bonus_type and in common/equipment_groups) CWT: Config/triggers_aat.cwt:16. */
  "has_mio_equipment_type"(value: string): boolean;
  /** Check if flag has been set within the military industrial organization in scope. May checks on the value or date/days since last modified date CWT: Config/triggers_aat.cwt:96. */
  "has_mio_flag"(value: string): boolean;
  /** Check if flag has been set within the military industrial organization in scope. May checks on the value or date/days since last modified date CWT: Config/triggers_aat.cwt:100. */
  "has_mio_flag"(value: { "flag": string; "value"?: number; "days"?: number } | CwtNode): boolean;
  /** Make comparaison on the number of unlocked traits of the military industrial organization in the scope. Can use < or > to compare the value with either a fixed value or from a variable CWT: Config/triggers_aat.cwt:82. */
  "has_mio_number_of_completed_traits"(value: number): boolean;
  /** Checks if the Military Industrial Organisation in scope has an allowed policy matching the input token CWT: Config/triggers_aat.cwt:110. */
  "has_mio_policy"(value: string): boolean;
  /** Checks if the Military Industrial Organisation in scope has an allowed matching the input token, which is currently attached to the MIO CWT: Config/triggers_aat.cwt:126. */
  "has_mio_policy_active"(value: string): boolean;
  /** Checks if the Military Industrial Organisation in scope has the input research category CWT: Config/triggers_aat.cwt:114. */
  "has_mio_research_category"(value: string): boolean;
  /** Make comparaison on the size of the military industrial organization in the scope. Can use < or > to compare the value with either a fixed value or with a variable CWT: Config/triggers_aat.cwt:12. */
  "has_mio_size"(value: number): boolean;
  /** Checks if the Military Industrial Organisation in scope has a trait matching the input token CWT: Config/triggers_aat.cwt:52. */
  "has_mio_trait"(value: string): boolean;
  /** Checks if the Military Industrial Organisation in scope has a trait matching the input token CWT: Config/triggers_aat.cwt:56. */
  "has_mio_trait"(value: { "trait": string } | CwtNode): boolean;
  /** Checks if a state contains a railway at or above the specified level. CWT: Config/triggers_nsb.cwt:29. */
  "has_railway_level"(value: { "level": number; "state": StateRef } | CwtNode): boolean;
  /** Compare the initial start date of current game. CWT: Config/triggers.cwt:615. */
  "has_start_date"(value: string): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1550. */
  "has_variable"(value: string): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1554. */
  "has_variable"(value: number): boolean;
  /** Trigger not shown in tooltips. CWT: Config/triggers.cwt:2114. */
  "hidden_trigger"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:14. */
  "if"(value: CwtNode): boolean;
  /** Checks if a the combatant or leader has a border war. CWT: Config/triggers.cwt:1586. */
  "is_border_war"(value: boolean): boolean;
  /** Returns true if game is in debug mode (launched with -debug argument). CWT: Config/triggers_new.cwt:86. */
  "is_debug"(value: boolean): boolean;
  /** Checks if scope leader is from an exiled government. is_exiled_leader = yes. CWT: Config/triggers.cwt:1681. */
  "is_exiled_leader"(value: true): boolean;
  /** Checks if scope leader is from specified exiled government. is_exiled_leader_from = FRA. CWT: Config/triggers.cwt:1700. */
  "is_exiled_leader_from"(value: CountryRef): boolean;
  /** Check if the historical focus is active. CWT: Config/triggers.cwt:992. */
  "is_historical_focus_on"(value: boolean): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1762. */
  "is_in_array"(value: { "array": string | CwtOpaque; "value": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1769. */
  "is_in_array"(value: CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1775. */
  "is_in_array"(value: { "variable_field_32": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Check if current game is ironman. CWT: Config/triggers.cwt:611. */
  "is_ironman"(value: boolean): boolean;
  /** Checks if the Military Industrial Organisation in scope matches the input token CWT: Config/triggers_aat.cwt:8. */
  "is_military_industrial_organization"(value: string): boolean;
  /** Checks if the Military Industrial Organisation in scope is assigned to at least 1 task CWT: Config/triggers_aat.cwt:48. */
  "is_mio_assigned_to_task"(value: boolean): boolean;
  /** Checks if MIO is available AND visible CWT: Config/triggers_aat.cwt:36. */
  "is_mio_available"(value: boolean): boolean;
  /** Checks if the Military Industrial Organisation in scope has a trait matching the input token, which is also available CWT: Config/triggers_aat.cwt:72. */
  "is_mio_trait_available"(value: string): boolean;
  /** Checks if the Military Industrial Organisation in scope has a trait matching the input token, which is also available CWT: Config/triggers_aat.cwt:76. */
  "is_mio_trait_available"(value: { "trait": string } | CwtNode): boolean;
  /** Checks if the Military Industrial Organisation in scope has a trait matching the input token, which is also completed CWT: Config/triggers_aat.cwt:62. */
  "is_mio_trait_completed"(value: string): boolean;
  /** Checks if the Military Industrial Organisation in scope has a trait matching the input token, which is also completed CWT: Config/triggers_aat.cwt:66. */
  "is_mio_trait_completed"(value: { "trait": string } | CwtNode): boolean;
  /** Checks if the visible trigger in the Military Industrial Organisation in scope returns true CWT: Config/triggers_aat.cwt:40. */
  "is_mio_visible"(value: boolean): boolean;
  /** Check if the tutorial is active. CWT: Config/triggers.cwt:988. */
  "is_tutorial"(value: boolean): boolean;
  /** All inside trigger must be true. At least one entry inside trigger must be true. Negates content of trigger. Print message to game.log - Can be localized. CWT: Config/triggers_new.cwt:15. */
  "log"(value: string): boolean;
  /** Meta triggers can be used for building triggers from strings and running them. following example will test if Germany has 42 pp. CWT: Config/triggers.cwt:1951. */
  "meta_trigger"(value: CwtNode): boolean;
  /** Modulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:161. */
  "modulo_temp_variable"(value: CwtNode): boolean;
  /** Mdulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:167. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:93. */
  "multiply_temp_variable"(value: CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:100. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /**  CWT: Config/scopes.cwt:34. */
  "NOT"(value: CwtNode): boolean;
  /**  CWT: Config/scopes.cwt:42. */
  "OR"(value: CwtNode): boolean;
  /** Compares the amount of turns that have passed during the peace conference with a number. CWT: Config/triggers_bba.cwt:175. */
  "pc_turn"(value: number): boolean;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/triggers.cwt:1635. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:143. */
  "randomize_temp_variable"(value: string): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:147. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1811. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1824. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1833. */
  "remove_from_temp_array"(value: CwtNode): boolean;
  /** Check amount of reserves. CWT: Config/triggers.cwt:76. */
  "reserves"(value: number): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1851. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1863. */
  "resize_temp_array"(value: CwtNode): boolean;
  /** Rounds a temporary variable. CWT: Config/variable_triggers_temp.cwt:200. */
  "round_temp_variable"(value: string): boolean;
  /** Check if the current scope exist. CWT: Config/triggers_gtd.cwt:104. */
  "scope_exists"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:1. */
  "scope_field"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:3. */
  "set_temp_variable"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:38. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:174. */
  "set_temp_variable_to_random"(value: string): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:178. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): boolean;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:82. */
  "subtract_from_temp_variable"(value: CwtNode): boolean;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_triggers_temp.cwt:89. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Check the global threat value. 0-1 value. CWT: Config/triggers.cwt:142. */
  "threat"(value: number): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:706. */
  "tooltip_evaluation"(value: "eval"): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:733. */
  "tooltip_evaluation"(value: "no_eval"): boolean;
}
export interface GeneratedPurchaseContractEffects {
  /** Add divisional commander xp to unit CWT: Config/effects_new.cwt:1018. */
  "add_divisional_commander_xp"(value: number): void;
  /** Adds the specified equipment bonuses to the country. As description the given loc key or the name of given special project will be used. Same usage as in Ideas/National spirits CWT: Config/effects_gtd.cwt:120. */
  "add_equipment_bonus"(value: { "name"?: string; "project"?: CwtOpaque; "bonus": CwtNode } | CwtNode): void;
  /** Adds new namespace. CWT: Config/effects.cwt:761. */
  "add_namespace"(value: string | number | boolean | CountryRef | StateRef): void;
  /** Add efficiency factor to strategic region for from country. CWT: Config/effects.cwt:2342. */
  "add_region_efficiency"(value: "replace_me"): void;
  /** Adds either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:154. */
  "add_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2824. */
  "add_to_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2846. */
  "add_to_array"(value: CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2943. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2965. */
  "add_to_temp_array"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:122. */
  "add_to_temp_variable"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:129. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:67. */
  "add_to_variable"(value: CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:71. */
  "add_to_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Adds victory point to province. CWT: Config/effects_new.cwt:957. */
  "add_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:51. */
  "AND"(value: CwtNode): void;
  /** Boost planning of units that are belongs to the army group/navy of this unit leader. CWT: Config/effects.cwt:2338. */
  "boost_planning"(value: number): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1372. */
  "break"(value: "none"): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1376. */
  "break"(value: true): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:844. */
  "build_railway"(value: { "path": readonly (number)[]; "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:878. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_province": number; "target_province": number; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:915. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_state": StateRef; "target_state": StateRef; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Cancels the scoped purchase contract CWT: Config/effects_aat.cwt:266. */
  "cancel_purchase_contract"(value: true): void;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_effects_temp.cwt:242. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): void;
  /** Clamps a variable between two a values or another variables. CWT: Config/variable_effects.cwt:188. */
  "clamp_variable"(value: { "var": CwtOpaque; "min"?: number | string; "max"?: number | string } | CwtNode): void;
  /** Clears the contents of array. CWT: Config/effects.cwt:2907. */
  "clear_array"(value: string | CwtOpaque): void;
  /** Clear a global event target. CWT: Config/effects.cwt:1364. */
  "clear_global_event_target"(value: string): void;
  /** Clear all global event targets. CWT: Config/effects.cwt:1368. */
  "clear_global_event_targets"(value: true): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3016. */
  "clear_temp_array"(value: string): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3019. */
  "clear_temp_array"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:206. */
  "clear_variable"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:210. */
  "clear_variable"(value: CwtOpaque): void;
  /** Clear global flag. CWT: Config/effects.cwt:170. */
  "clr_global_flag"(value: string): void;
  /** Creates a dynamic country and runs child effects on it. CWT: Config/effects_new.cwt:327. */
  "create_dynamic_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Creates an enitity Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. For comparison, default minimum zoom level (closest to the map) is 50 units, while default maximum CWT: Config/effects_nsb.cwt:823. */
  "create_entity"(value: { "entity": string; "id"?: string; "var"?: string; "x"?: number; "y"?: number; "z"?: number; "province"?: number; "state"?: StateRef; "rotation": number; "scale": number; "min_zoom": number; "visible"?: string } | CwtNode): void;
  /** Creates a purchase contract between the countries CWT: Config/effects_aat.cwt:253. */
  "create_purchase_contract"(value: { "seller": CountryRef; "buyer": CountryRef; "civilian_factories": number; "equipment": { "type": string; "amount": number } | CwtNode } | CwtNode): void;
  /** Create railway gun effect CWT: Config/effects_nsb.cwt:713. */
  "create_railway_gun"(value: { "equipment": string; "name"?: string; "location"?: number } | CwtNode): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:14. */
  "custom_effect_tooltip"(value: string): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:17. */
  "custom_effect_tooltip"(value: CwtNode): void;
  /** Executes the provided effects but with a custom tooltip surpressing all tooltips from all other effects inside this block. The custom tooltip is a [bindable localization] CWT: Config/effects_gtd.cwt:318. */
  "custom_override_tooltip"(value: CwtNode): void;
  /** Destroys an existing entity IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:849. */
  "destroy_entity"(value: string): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:155. */
  "divide_temp_variable"(value: CwtNode): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:179. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:91. */
  "divide_variable"(value: CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:116. */
  "divide_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Shows just tooltip of effects. CWT: Config/effects.cwt:1510. */
  "effect_tooltip"(value: CwtNode): void;
  /** Use after (else_)if for a catch-all case. CWT: Config/effects.cwt:431. */
  "else"(value: CwtNode): void;
  /** Use after (else_)if to check other triggers only if first if fails. CWT: Config/effects.cwt:422. */
  "else_if"(value: CwtNode): void;
  /** Shows event option tooltip CWT: Config/effects.cwt:27. */
  "event_option_tooltip"(value: string): void;
  /** - Example *every_collection_element = { limit = { xxx } add_political_power = 1 } - Some collections, like 'country:faction_members', require country scope - Supports 'limit' trigger Applies arbitrary effects to all elements of a collection. Supports both anonymous and regular collections CWT: Config/effects_ncns.cwt:248. */
  "every_collection_element"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfills the "limit" trigger. CWT: Config/effects.cwt:205. */
  "every_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a all countries with original tag. tooltip=key can be defined to override tooltip title. CWT: Config/effects_new.cwt:445. */
  "every_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfils the "limit" trigger. Difference with every_country is that it includes countries not yet present on the map. tooltip=key can be defined to override tooltip title. CWT: Config/effects_nsb.cwt:599. */
  "every_possible_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1067. */
  "every_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/effects.cwt:3261. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/effects.cwt:3247. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array. CWT: Config/effects.cwt:3042. */
  "for_each_loop"(value: CwtNode): void;
  /** Runs a loop on for each element of an array and changes scope to current element in each iteration. CWT: Config/effects.cwt:3068. */
  "for_each_scope_loop"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Runs a same effects through a loop. example will run the effects for value_name = -3, 0, 3, 6, 9 and then terminate. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. Consider using for_each_loop instead. CWT: Config/effects.cwt:3175. */
  "for_loop_effect"(value: CwtNode): void;
  /** Executes children effects on army leaders for every country in the world that fulfills the "limit" trigger. Better to use every_army_leader if you know the country. CWT: Config/effects.cwt:2355. */
  "global_every_army_leader"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Goes to stated province. CWT: Config/effects.cwt:1690. */
  "goto_province"(value: number): void;
  /** Goes to stated state. CWT: Config/effects.cwt:1694. */
  "goto_state"(value: StateRef): void;
  /** Effect not shown in tooltips. CWT: Config/effects.cwt:3783. */
  "hidden_effect"(value: CwtNode): void;
  /** A conditional effect. CWT: Config/effects.cwt:413. */
  "if"(value: CwtNode): void;
  /** Print message to game.log - Can be localized. CWT: Config/effects.cwt:493. */
  "log"(value: string): void;
  /** Meta effects can be used for building effects from strings and running them. following example will give Germany 42 pp. CWT: Config/effects.cwt:3214. */
  "meta_effect"(value: CwtNode): void;
  /** Modify global flag. Only modifies if flag already exists. CWT: Config/effects.cwt:2071. */
  "modify_global_flag"(value: { "flag": string; "value"?: number; "days"?: number } | CwtNode): void;
  /** Modulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:213. */
  "modulo_temp_variable"(value: CwtNode): void;
  /** Mdulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:219. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:155. */
  "modulo_variable"(value: CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:161. */
  "modulo_variable"(value: { "var": CwtOpaque; "value": number } | CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:144. */
  "multiply_temp_variable"(value: CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:151. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:83. */
  "multiply_variable"(value: CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:87. */
  "multiply_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:44. */
  "NOT"(value: CwtNode): void;
  /**  CWT: Config/scopes.cwt:52. */
  "OR"(value: CwtNode): void;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/effects.cwt:2572. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): void;
  /** Promote the officer of the division to a general scope = unit CWT: Config/effects_gtd.cwt:298. */
  "promote_officer_to_general"(value: boolean): void;
  /** A possible random effect that can occur. CWT: Config/effects.cwt:343. */
  "random"(value: CwtNode): void;
  /** Executes children effects on random country that fulfills the "limit" trigger. CWT: Config/effects.cwt:211. */
  "random_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a random country with original tag. CWT: Config/effects_new.cwt:420. */
  "random_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** A list of possible random effects to trigger in this effect. CWT: Config/effects.cwt:355. */
  "random_list"(value: CwtNode): void;
  /** Runs the effect for a random element in array. CWT: Config/effects.cwt:3082. */
  "random_scope_in_array"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on random state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1049. */
  "random_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:194. */
  "randomize_temp_variable"(value: string): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:198. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:132. */
  "randomize_variable"(value: string): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:136. */
  "randomize_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number | string; "max"?: number | string; "lambda"?: number } | CwtNode): void;
  /** Randomize weather effect. CWT: Config/effects.cwt:570. */
  "randomize_weather"(value: number): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2869. */
  "remove_from_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2884. */
  "remove_from_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2894. */
  "remove_from_array"(value: CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2978. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2993. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:3003. */
  "remove_from_temp_array"(value: CwtNode): void;
  /** Removes either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:164. */
  "remove_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:123. */
  "remove_unit_leader_role"(value: string): void;
  /** Reset name of a province back to localization one. CWT: Config/effects.cwt:2120. */
  "reset_province_name"(value: number): void;
  /** Resizes array. CWT: Config/effects.cwt:2911. */
  "resize_array"(value: { "array": string; "value"?: number | string; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes array. CWT: Config/effects.cwt:2928. */
  "resize_array"(value: CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3023. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3035. */
  "resize_temp_array"(value: CwtNode): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:397. */
  "retire_character"(value: string): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:409. */
  "retire_character"(value: CwtOpaque): void;
  /** Rounds a temporary variable. CWT: Config/variable_effects_temp.cwt:252. */
  "round_temp_variable"(value: string): void;
  /** Rounds a variable. CWT: Config/variable_effects.cwt:202. */
  "round_variable"(value: CwtOpaque): void;
  /** Save an event target. CWT: Config/effects.cwt:1356. */
  "save_event_target_as"(value: string): void;
  /** Save a global event target. CWT: Config/effects.cwt:1360. */
  "save_global_event_target_as"(value: string): void;
  /**  CWT: Config/scopes.cwt:32. */
  "scope_field"(value: CwtNode): void;
  /** Sets the animation of a specified entity IDs are set by the create_entity effect. Animations are defined within the /Hearts of Iron IV/gfx/models/** /*.asset files. CWT: Config/effects_nsb.cwt:903. */
  "set_entity_animation"(value: { "id": string; "animation": string } | CwtNode): void;
  /** Sets the position and rotation of an entity using two coordinates. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:855. */
  "set_entity_movement"(value: { "id": string; "start": { "x": number; "y": number; "z"?: number } | CwtNode; "target": { "province": number } | CwtNode; "ratio": number; "rotation": number } | CwtNode): void;
  /** Sets the position of an existing entity. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. CWT: Config/effects_nsb.cwt:873. */
  "set_entity_position"(value: { "id": string; "x": number; "y": number; "z"?: number; "province": "enum"; "state": StateRef } | CwtNode): void;
  /** Sets the currently-facing angle of an existing entity. IDs are set by the create_entity effect. A positive change results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:887. */
  "set_entity_rotation"(value: { "id": string; "rotation": number } | CwtNode): void;
  /** Sets the size of an existing entity. IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:895. */
  "set_entity_scale"(value: { "id": string; "scale": number } | CwtNode): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:269. */
  "set_faction_military_unlocked"(value: boolean): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:265. */
  "set_faction_research_unlocked"(value: boolean): void;
  /** Set global flag. CWT: Config/effects.cwt:157. */
  "set_global_flag"(value: string): void;
  /** Set global flag. CWT: Config/effects.cwt:160. */
  "set_global_flag"(value: { "flag": string; "value": number; "days"?: number } | CwtNode): void;
  /** Set_province_name = { id = <province id> name = <string> } - Set name for a province. CWT: Config/effects.cwt:2109. */
  "set_province_name"(value: { "id": number; "name": string } | CwtNode): void;
  /** # TEMP VARIABLE Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:53. */
  "set_temp_variable"(value: CwtNode): void;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:88. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:226. */
  "set_temp_variable_to_random"(value: string): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:230. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:3. */
  "set_variable"(value: CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:37. */
  "set_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:168. */
  "set_variable_to_random"(value: string): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:172. */
  "set_variable_to_random"(value: { "var": string; "min"?: number | string; "max"?: number | string; "integer"?: boolean } | CwtNode): void;
  /** Sets victory point to province. CWT: Config/effects_new.cwt:964. */
  "set_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /** Plays sound effect. CWT: Config/effects.cwt:562. */
  "sound_effect"(value: string): void;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:133. */
  "subtract_from_temp_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_effects_temp.cwt:140. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:75. */
  "subtract_from_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:79. */
  "subtract_from_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /**  CWT: Config/effects.cwt:1381. */
  "unlock_national_focus"(value: string): void;
  /** Runs the effect as long as a trigger is true. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. CWT: Config/effects.cwt:3200. */
  "while_loop_effect"(value: CwtNode): void;
}
export interface GeneratedPurchaseContractTriggers {
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1781. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef; "index"?: "int_variable_field_32" } | CwtNode): boolean;
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1800. */
  "add_to_temp_array"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:71. */
  "add_to_temp_variable"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:78. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { all_collection_elements = { ``` Example (anonymous collection): Example: *all_collection_elements = { coll CWT: Config/triggers_ncns.cwt:151. */
  "all_collection_elements"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all countries meets the trigger. CWT: Config/triggers.cwt:223. */
  "all_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if all of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:507. */
  "all_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if all country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:195. */
  "all_country_with_original_tag"(value: CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1887. */
  "all_of"(value: CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1918. */
  "all_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all states meets the trigger. CWT: Config/triggers.cwt:525. */
  "all_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Always returns specified value. CWT: Config/triggers.cwt:146. */
  "always"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:41. */
  "AND"(value: CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { any_collection_element = { ``` Example (anonymous collection): Example: *any_collection_element = { collec CWT: Config/triggers_ncns.cwt:124. */
  "any_collection_element"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any country meets the trigger. CWT: Config/triggers.cwt:89. */
  "any_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:533. */
  "any_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:182. */
  "any_country_with_original_tag"(value: CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:552. */
  "any_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1871. */
  "any_of"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1908. */
  "any_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any other country meets the trigger. Excludes current country. CWT: Config/triggers.cwt:1095. */
  "any_other_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries (except for the current country) fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:571. */
  "any_other_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries and isn't the current country fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:590. */
  "any_other_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any state meets the trigger. CWT: Config/triggers.cwt:505. */
  "any_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** check if any state in the given category meets the trigger. CWT: Config/triggers_gtd.cwt:84. */
  "any_state_in"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Checks if any of the provided states fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:482. */
  "any_state_of"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Check the buyer country. Example: buyer = GER CWT: Config/triggers_aat.cwt:158. */
  "buyer"(value: CountryRef): boolean;
  /** Evaluates a math expression and returns true when the result is non-zero. CWT: Config/triggers_taog.cwt:57. */
  "check_expr"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:93. */
  "check_variable"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:105. */
  "check_variable"(value: { "var": string | number | boolean | CountryRef | StateRef; "value": string | number | boolean | CountryRef | StateRef; "compare"?: string; "tooltip"?: string } | CwtNode): boolean;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_triggers_temp.cwt:190. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1844. */
  "clear_temp_array"(value: string | CwtOpaque): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1847. */
  "clear_temp_array"(value: number): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:167. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "country": CountryRef } | CwtNode): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:186. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "countries": readonly (CountryRef)[] } | CwtNode): boolean;
  /** - Example: *collection_size = { input = collection:my_awesome_collection value > 1 }* - Variables can be used - Multiple comparisons are allowed: value > x value < y - Supported operators: <, >, = (THIS IS NOT TRUE AS OF 1.17.0.7) - Comparison is inclusive, so "value > X" actually means "value >= X" CWT: Config/triggers_ncns.cwt:396. */
  "collection_size"(value: { "input": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "value": number } | CwtNode): boolean;
  /** Check if contract contains equipment category, equipment archetype or equipment CWT: Config/triggers_aat.cwt:150. */
  "contract_contains_equipment"(value: string): boolean;
  /** Returns true if the specified number of sub-triggers return true. CWT: Config/triggers.cwt:1278. */
  "count_triggers"(value: CwtNode): boolean;
  /** Check if the specified country exist. CWT: Config/triggers.cwt:354. */
  "country_exists"(value: CountryRef): boolean;
  /**  CWT: Config/triggers_gtd.cwt:153. */
  "custom_override_tooltip"(value: CwtNode): boolean;
  /** Works as an and-trigger with a custom tooltip. CWT: Config/triggers.cwt:760. */
  "custom_trigger_tooltip"(value: CwtNode): boolean;
  /** Checks for a specific date. CWT: Config/triggers.cwt:619. */
  "date"(value: string): boolean;
  /** Check value of purchase contract completion. Example: deal_completition < 0.6" CWT: Config/triggers_aat.cwt:154. */
  "deal_completion"(value: number): boolean;
  /** Evaluates a math expression and writes the numeric result to the tooltip. CWT: Config/triggers_taog.cwt:31. */
  "debug_math_expr"(value: CwtNode): boolean;
  /** Check if the difficulty is above or below specified value 0-2 (difficulty enum). Example: difficulty > 0 (above easy). CWT: Config/triggers.cwt:46. */
  "difficulty"(value: number): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:104. */
  "divide_temp_variable"(value: CwtNode): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:128. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:28. */
  "else"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:21. */
  "else_if"(value: CwtNode): boolean;
  /** check cost of equipment production line CWT: Config/triggers_gtd.cwt:108. */
  "equipment_cost"(value: CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/triggers.cwt:2006. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/triggers.cwt:1992. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Returns true if all of the active game rule options allow achievements. CWT: Config/triggers.cwt:1758. */
  "game_rules_allow_achievements"(value: true): boolean;
  /** Returns true if the game has any custom difficulty on. CWT: Config/triggers.cwt:1124. */
  "has_any_custom_difficulty_setting"(value: boolean): boolean;
  /** Returns true if the game has the specified custom difficulty on. CWT: Config/triggers.cwt:1120. */
  "has_custom_difficulty_setting"(value: string): boolean;
  /** Checks if player has a DLC. Example: has_dlc = "name of the dlc". CWT: Config/triggers.cwt:176. */
  "has_dlc"(value: string): boolean;
  /** Checks if current scope or global scope has the specified event target saved. CWT: Config/triggers.cwt:1570. */
  "has_event_target"(value: string): boolean;
  /** Checks if a game rule is set to a particular option. CWT: Config/triggers.cwt:1751. */
  "has_game_rule"(value: { "rule": string; "option": string } | CwtNode): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:155. */
  "has_global_flag"(value: string): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:160. */
  "has_global_flag"(value: { "flag": string; "value"?: number; "date"?: string; "days"?: number } | CwtNode): boolean;
  /** Checks if a state contains a railway at or above the specified level. CWT: Config/triggers_nsb.cwt:29. */
  "has_railway_level"(value: { "level": number; "state": StateRef } | CwtNode): boolean;
  /** Compare the initial start date of current game. CWT: Config/triggers.cwt:615. */
  "has_start_date"(value: string): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1550. */
  "has_variable"(value: string): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1554. */
  "has_variable"(value: number): boolean;
  /** Trigger not shown in tooltips. CWT: Config/triggers.cwt:2114. */
  "hidden_trigger"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:14. */
  "if"(value: CwtNode): boolean;
  /** Checks if a the combatant or leader has a border war. CWT: Config/triggers.cwt:1586. */
  "is_border_war"(value: boolean): boolean;
  /** Returns true if game is in debug mode (launched with -debug argument). CWT: Config/triggers_new.cwt:86. */
  "is_debug"(value: boolean): boolean;
  /** Checks if scope leader is from an exiled government. is_exiled_leader = yes. CWT: Config/triggers.cwt:1681. */
  "is_exiled_leader"(value: true): boolean;
  /** Checks if scope leader is from specified exiled government. is_exiled_leader_from = FRA. CWT: Config/triggers.cwt:1700. */
  "is_exiled_leader_from"(value: CountryRef): boolean;
  /** Check if the historical focus is active. CWT: Config/triggers.cwt:992. */
  "is_historical_focus_on"(value: boolean): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1762. */
  "is_in_array"(value: { "array": string | CwtOpaque; "value": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1769. */
  "is_in_array"(value: CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1775. */
  "is_in_array"(value: { "variable_field_32": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Check if current game is ironman. CWT: Config/triggers.cwt:611. */
  "is_ironman"(value: boolean): boolean;
  /** Check if the tutorial is active. CWT: Config/triggers.cwt:988. */
  "is_tutorial"(value: boolean): boolean;
  /** All inside trigger must be true. At least one entry inside trigger must be true. Negates content of trigger. Print message to game.log - Can be localized. CWT: Config/triggers_new.cwt:15. */
  "log"(value: string): boolean;
  /** Meta triggers can be used for building triggers from strings and running them. following example will test if Germany has 42 pp. CWT: Config/triggers.cwt:1951. */
  "meta_trigger"(value: CwtNode): boolean;
  /** Modulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:161. */
  "modulo_temp_variable"(value: CwtNode): boolean;
  /** Mdulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:167. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:93. */
  "multiply_temp_variable"(value: CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:100. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /**  CWT: Config/scopes.cwt:34. */
  "NOT"(value: CwtNode): boolean;
  /**  CWT: Config/scopes.cwt:42. */
  "OR"(value: CwtNode): boolean;
  /** Compares the amount of turns that have passed during the peace conference with a number. CWT: Config/triggers_bba.cwt:175. */
  "pc_turn"(value: number): boolean;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/triggers.cwt:1635. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:143. */
  "randomize_temp_variable"(value: string): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:147. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1811. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1824. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1833. */
  "remove_from_temp_array"(value: CwtNode): boolean;
  /** Check amount of reserves. CWT: Config/triggers.cwt:76. */
  "reserves"(value: number): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1851. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1863. */
  "resize_temp_array"(value: CwtNode): boolean;
  /** Rounds a temporary variable. CWT: Config/variable_triggers_temp.cwt:200. */
  "round_temp_variable"(value: string): boolean;
  /** Check if the current scope exist. CWT: Config/triggers_gtd.cwt:104. */
  "scope_exists"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:1. */
  "scope_field"(value: CwtNode): boolean;
  /** Check the seller country. Example: seller = GER CWT: Config/triggers_aat.cwt:162. */
  "seller"(value: CountryRef): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:3. */
  "set_temp_variable"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:38. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:174. */
  "set_temp_variable_to_random"(value: string): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:178. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): boolean;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:82. */
  "subtract_from_temp_variable"(value: CwtNode): boolean;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_triggers_temp.cwt:89. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Check the global threat value. 0-1 value. CWT: Config/triggers.cwt:142. */
  "threat"(value: number): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:706. */
  "tooltip_evaluation"(value: "eval"): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:733. */
  "tooltip_evaluation"(value: "no_eval"): boolean;
}
export interface GeneratedUnitEffects {
  /** Add divisional commander xp to unit CWT: Config/effects_new.cwt:1018. */
  "add_divisional_commander_xp"(value: number): void;
  /** Adds the specified equipment bonuses to the country. As description the given loc key or the name of given special project will be used. Same usage as in Ideas/National spirits CWT: Config/effects_gtd.cwt:120. */
  "add_equipment_bonus"(value: { "name"?: string; "project"?: CwtOpaque; "bonus": CwtNode } | CwtNode): void;
  /** Add history entry to a unit in scope CWT: Config/effects_bba.cwt:144. */
  "add_history_entry"(value: { "key": string; "subject": string; "allow": boolean } | CwtNode): void;
  /** Adds new namespace. CWT: Config/effects.cwt:761. */
  "add_namespace"(value: string | number | boolean | CountryRef | StateRef): void;
  /**  CWT: Config/effects_bba.cwt:82. */
  "add_random_valid_trait_from_unit"(value: { "character": string | CwtOpaque } | CwtNode): void;
  /** Add efficiency factor to strategic region for from country. CWT: Config/effects.cwt:2342. */
  "add_region_efficiency"(value: "replace_me"): void;
  /** Adds either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:154. */
  "add_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2824. */
  "add_to_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2846. */
  "add_to_array"(value: CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2943. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2965. */
  "add_to_temp_array"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:122. */
  "add_to_temp_variable"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:129. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:67. */
  "add_to_variable"(value: CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:71. */
  "add_to_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Add a medal to latest history entry of a unit in scope. Check 'add_history_entry' to create a new entry CWT: Config/effects_bba.cwt:153. */
  "add_unit_medal_to_latest_entry"(value: { "unit_medals": string } | CwtNode): void;
  /** Adds victory point to province. CWT: Config/effects_new.cwt:957. */
  "add_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:51. */
  "AND"(value: CwtNode): void;
  /** Boost planning of units that are belongs to the army group/navy of this unit leader. CWT: Config/effects.cwt:2338. */
  "boost_planning"(value: number): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1372. */
  "break"(value: "none"): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1376. */
  "break"(value: true): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:844. */
  "build_railway"(value: { "path": readonly (number)[]; "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:878. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_province": number; "target_province": number; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:915. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_state": StateRef; "target_state": StateRef; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Change divisions in scope to selected template CWT: Config/effects_bba.cwt:124. */
  "change_division_template"(value: { "division_template": string } | CwtNode): void;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_effects_temp.cwt:242. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): void;
  /** Clamps a variable between two a values or another variables. CWT: Config/variable_effects.cwt:188. */
  "clamp_variable"(value: { "var": CwtOpaque; "min"?: number | string; "max"?: number | string } | CwtNode): void;
  /** Clears the contents of array. CWT: Config/effects.cwt:2907. */
  "clear_array"(value: string | CwtOpaque): void;
  /** Clear a global event target. CWT: Config/effects.cwt:1364. */
  "clear_global_event_target"(value: string): void;
  /** Clear all global event targets. CWT: Config/effects.cwt:1368. */
  "clear_global_event_targets"(value: true): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3016. */
  "clear_temp_array"(value: string): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3019. */
  "clear_temp_array"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:206. */
  "clear_variable"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:210. */
  "clear_variable"(value: CwtOpaque): void;
  /** Clear global flag. CWT: Config/effects.cwt:170. */
  "clr_global_flag"(value: string): void;
  /** Creates a dynamic country and runs child effects on it. CWT: Config/effects_new.cwt:327. */
  "create_dynamic_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Creates an enitity Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. For comparison, default minimum zoom level (closest to the map) is 50 units, while default maximum CWT: Config/effects_nsb.cwt:823. */
  "create_entity"(value: { "entity": string; "id"?: string; "var"?: string; "x"?: number; "y"?: number; "z"?: number; "province"?: number; "state"?: StateRef; "rotation": number; "scale": number; "min_zoom": number; "visible"?: string } | CwtNode): void;
  /** Creates a purchase contract between the countries CWT: Config/effects_aat.cwt:253. */
  "create_purchase_contract"(value: { "seller": CountryRef; "buyer": CountryRef; "civilian_factories": number; "equipment": { "type": string; "amount": number } | CwtNode } | CwtNode): void;
  /** Create railway gun effect CWT: Config/effects_nsb.cwt:713. */
  "create_railway_gun"(value: { "equipment": string; "name"?: string; "location"?: number } | CwtNode): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:14. */
  "custom_effect_tooltip"(value: string): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:17. */
  "custom_effect_tooltip"(value: CwtNode): void;
  /** Executes the provided effects but with a custom tooltip surpressing all tooltips from all other effects inside this block. The custom tooltip is a [bindable localization] CWT: Config/effects_gtd.cwt:318. */
  "custom_override_tooltip"(value: CwtNode): void;
  /** Destroys an existing entity IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:849. */
  "destroy_entity"(value: string): void;
  /** Destroys the currently-scoped division. CWT: Config/effects_bba.cwt:140. */
  "destroy_unit"(value: boolean): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:155. */
  "divide_temp_variable"(value: CwtNode): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:179. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:91. */
  "divide_variable"(value: CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:116. */
  "divide_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Shows just tooltip of effects. CWT: Config/effects.cwt:1510. */
  "effect_tooltip"(value: CwtNode): void;
  /** Use after (else_)if for a catch-all case. CWT: Config/effects.cwt:431. */
  "else"(value: CwtNode): void;
  /** Use after (else_)if to check other triggers only if first if fails. CWT: Config/effects.cwt:422. */
  "else_if"(value: CwtNode): void;
  /** Shows event option tooltip CWT: Config/effects.cwt:27. */
  "event_option_tooltip"(value: string): void;
  /** - Example *every_collection_element = { limit = { xxx } add_political_power = 1 } - Some collections, like 'country:faction_members', require country scope - Supports 'limit' trigger Applies arbitrary effects to all elements of a collection. Supports both anonymous and regular collections CWT: Config/effects_ncns.cwt:248. */
  "every_collection_element"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfills the "limit" trigger. CWT: Config/effects.cwt:205. */
  "every_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a all countries with original tag. tooltip=key can be defined to override tooltip title. CWT: Config/effects_new.cwt:445. */
  "every_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfils the "limit" trigger. Difference with every_country is that it includes countries not yet present on the map. tooltip=key can be defined to override tooltip title. CWT: Config/effects_nsb.cwt:599. */
  "every_possible_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1067. */
  "every_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/effects.cwt:3261. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/effects.cwt:3247. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array. CWT: Config/effects.cwt:3042. */
  "for_each_loop"(value: CwtNode): void;
  /** Runs a loop on for each element of an array and changes scope to current element in each iteration. CWT: Config/effects.cwt:3068. */
  "for_each_scope_loop"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Runs a same effects through a loop. example will run the effects for value_name = -3, 0, 3, 6, 9 and then terminate. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. Consider using for_each_loop instead. CWT: Config/effects.cwt:3175. */
  "for_loop_effect"(value: CwtNode): void;
  /** Executes children effects on army leaders for every country in the world that fulfills the "limit" trigger. Better to use every_army_leader if you know the country. CWT: Config/effects.cwt:2355. */
  "global_every_army_leader"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Goes to stated province. CWT: Config/effects.cwt:1690. */
  "goto_province"(value: number): void;
  /** Goes to stated state. CWT: Config/effects.cwt:1694. */
  "goto_state"(value: StateRef): void;
  /** Effect not shown in tooltips. CWT: Config/effects.cwt:3783. */
  "hidden_effect"(value: CwtNode): void;
  /** A conditional effect. CWT: Config/effects.cwt:413. */
  "if"(value: CwtNode): void;
  /** Print message to game.log - Can be localized. CWT: Config/effects.cwt:493. */
  "log"(value: string): void;
  /** Meta effects can be used for building effects from strings and running them. following example will give Germany 42 pp. CWT: Config/effects.cwt:3214. */
  "meta_effect"(value: CwtNode): void;
  /** Modify global flag. Only modifies if flag already exists. CWT: Config/effects.cwt:2071. */
  "modify_global_flag"(value: { "flag": string; "value"?: number; "days"?: number } | CwtNode): void;
  /** Modulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:213. */
  "modulo_temp_variable"(value: CwtNode): void;
  /** Mdulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:219. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:155. */
  "modulo_variable"(value: CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:161. */
  "modulo_variable"(value: { "var": CwtOpaque; "value": number } | CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:144. */
  "multiply_temp_variable"(value: CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:151. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:83. */
  "multiply_variable"(value: CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:87. */
  "multiply_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:44. */
  "NOT"(value: CwtNode): void;
  /**  CWT: Config/scopes.cwt:52. */
  "OR"(value: CwtNode): void;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/effects.cwt:2572. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): void;
  /** Promote the officer of the division to a general scope = unit CWT: Config/effects_gtd.cwt:298. */
  "promote_officer_to_general"(value: boolean): void;
  /** A possible random effect that can occur. CWT: Config/effects.cwt:343. */
  "random"(value: CwtNode): void;
  /** Executes children effects on random country that fulfills the "limit" trigger. CWT: Config/effects.cwt:211. */
  "random_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a random country with original tag. CWT: Config/effects_new.cwt:420. */
  "random_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** A list of possible random effects to trigger in this effect. CWT: Config/effects.cwt:355. */
  "random_list"(value: CwtNode): void;
  /** Runs the effect for a random element in array. CWT: Config/effects.cwt:3082. */
  "random_scope_in_array"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on random state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1049. */
  "random_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:194. */
  "randomize_temp_variable"(value: string): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:198. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:132. */
  "randomize_variable"(value: string): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:136. */
  "randomize_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number | string; "max"?: number | string; "lambda"?: number } | CwtNode): void;
  /** Randomize weather effect. CWT: Config/effects.cwt:570. */
  "randomize_weather"(value: number): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2869. */
  "remove_from_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2884. */
  "remove_from_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2894. */
  "remove_from_array"(value: CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2978. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2993. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:3003. */
  "remove_from_temp_array"(value: CwtNode): void;
  /** Removes either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:164. */
  "remove_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:123. */
  "remove_unit_leader_role"(value: string): void;
  /** Reset name of a province back to localization one. CWT: Config/effects.cwt:2120. */
  "reset_province_name"(value: number): void;
  /** Resizes array. CWT: Config/effects.cwt:2911. */
  "resize_array"(value: { "array": string; "value"?: number | string; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes array. CWT: Config/effects.cwt:2928. */
  "resize_array"(value: CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3023. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3035. */
  "resize_temp_array"(value: CwtNode): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:397. */
  "retire_character"(value: string): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:409. */
  "retire_character"(value: CwtOpaque): void;
  /** Rounds a temporary variable. CWT: Config/variable_effects_temp.cwt:252. */
  "round_temp_variable"(value: string): void;
  /** Rounds a variable. CWT: Config/variable_effects.cwt:202. */
  "round_variable"(value: CwtOpaque): void;
  /** Save an event target. CWT: Config/effects.cwt:1356. */
  "save_event_target_as"(value: string): void;
  /** Save a global event target. CWT: Config/effects.cwt:1360. */
  "save_global_event_target_as"(value: string): void;
  /**  CWT: Config/scopes.cwt:32. */
  "scope_field"(value: CwtNode): void;
  /** Sets the animation of a specified entity IDs are set by the create_entity effect. Animations are defined within the /Hearts of Iron IV/gfx/models/** /*.asset files. CWT: Config/effects_nsb.cwt:903. */
  "set_entity_animation"(value: { "id": string; "animation": string } | CwtNode): void;
  /** Sets the position and rotation of an entity using two coordinates. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:855. */
  "set_entity_movement"(value: { "id": string; "start": { "x": number; "y": number; "z"?: number } | CwtNode; "target": { "province": number } | CwtNode; "ratio": number; "rotation": number } | CwtNode): void;
  /** Sets the position of an existing entity. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. CWT: Config/effects_nsb.cwt:873. */
  "set_entity_position"(value: { "id": string; "x": number; "y": number; "z"?: number; "province": "enum"; "state": StateRef } | CwtNode): void;
  /** Sets the currently-facing angle of an existing entity. IDs are set by the create_entity effect. A positive change results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:887. */
  "set_entity_rotation"(value: { "id": string; "rotation": number } | CwtNode): void;
  /** Sets the size of an existing entity. IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:895. */
  "set_entity_scale"(value: { "id": string; "scale": number } | CwtNode): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:269. */
  "set_faction_military_unlocked"(value: boolean): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:265. */
  "set_faction_research_unlocked"(value: boolean): void;
  /** Set global flag. CWT: Config/effects.cwt:157. */
  "set_global_flag"(value: string): void;
  /** Set global flag. CWT: Config/effects.cwt:160. */
  "set_global_flag"(value: { "flag": string; "value": number; "days"?: number } | CwtNode): void;
  /** Set_province_name = { id = <province id> name = <string> } - Set name for a province. CWT: Config/effects.cwt:2109. */
  "set_province_name"(value: { "id": number; "name": string } | CwtNode): void;
  /** # TEMP VARIABLE Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:53. */
  "set_temp_variable"(value: CwtNode): void;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:88. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:226. */
  "set_temp_variable_to_random"(value: string): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:230. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): void;
  /** Set unit org to a specific value CWT: Config/effects_bba.cwt:130. */
  "set_unit_organization"(value: number): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:3. */
  "set_variable"(value: CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:37. */
  "set_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:168. */
  "set_variable_to_random"(value: string): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:172. */
  "set_variable_to_random"(value: { "var": string; "min"?: number | string; "max"?: number | string; "integer"?: boolean } | CwtNode): void;
  /** Sets victory point to province. CWT: Config/effects_new.cwt:964. */
  "set_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /** Plays sound effect. CWT: Config/effects.cwt:562. */
  "sound_effect"(value: string): void;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:133. */
  "subtract_from_temp_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_effects_temp.cwt:140. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:75. */
  "subtract_from_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:79. */
  "subtract_from_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /**  CWT: Config/effects.cwt:1381. */
  "unlock_national_focus"(value: string): void;
  /** Runs the effect as long as a trigger is true. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. CWT: Config/effects.cwt:3200. */
  "while_loop_effect"(value: CwtNode): void;
}
export interface GeneratedUnitTriggers {
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1781. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef; "index"?: "int_variable_field_32" } | CwtNode): boolean;
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1800. */
  "add_to_temp_array"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:71. */
  "add_to_temp_variable"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:78. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { all_collection_elements = { ``` Example (anonymous collection): Example: *all_collection_elements = { coll CWT: Config/triggers_ncns.cwt:151. */
  "all_collection_elements"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all countries meets the trigger. CWT: Config/triggers.cwt:223. */
  "all_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if all of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:507. */
  "all_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if all country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:195. */
  "all_country_with_original_tag"(value: CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1887. */
  "all_of"(value: CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1918. */
  "all_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all states meets the trigger. CWT: Config/triggers.cwt:525. */
  "all_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Always returns specified value. CWT: Config/triggers.cwt:146. */
  "always"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:41. */
  "AND"(value: CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { any_collection_element = { ``` Example (anonymous collection): Example: *any_collection_element = { collec CWT: Config/triggers_ncns.cwt:124. */
  "any_collection_element"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any country meets the trigger. CWT: Config/triggers.cwt:89. */
  "any_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:533. */
  "any_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:182. */
  "any_country_with_original_tag"(value: CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:552. */
  "any_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1871. */
  "any_of"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1908. */
  "any_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any other country meets the trigger. Excludes current country. CWT: Config/triggers.cwt:1095. */
  "any_other_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries (except for the current country) fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:571. */
  "any_other_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries and isn't the current country fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:590. */
  "any_other_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any state meets the trigger. CWT: Config/triggers.cwt:505. */
  "any_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** check if any state in the given category meets the trigger. CWT: Config/triggers_gtd.cwt:84. */
  "any_state_in"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Checks if any of the provided states fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:482. */
  "any_state_of"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Evaluates a math expression and returns true when the result is non-zero. CWT: Config/triggers_taog.cwt:57. */
  "check_expr"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:93. */
  "check_variable"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:105. */
  "check_variable"(value: { "var": string | number | boolean | CountryRef | StateRef; "value": string | number | boolean | CountryRef | StateRef; "compare"?: string; "tooltip"?: string } | CwtNode): boolean;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_triggers_temp.cwt:190. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1844. */
  "clear_temp_array"(value: string | CwtOpaque): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1847. */
  "clear_temp_array"(value: number): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:167. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "country": CountryRef } | CwtNode): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:186. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "countries": readonly (CountryRef)[] } | CwtNode): boolean;
  /** - Example: *collection_size = { input = collection:my_awesome_collection value > 1 }* - Variables can be used - Multiple comparisons are allowed: value > x value < y - Supported operators: <, >, = (THIS IS NOT TRUE AS OF 1.17.0.7) - Comparison is inclusive, so "value > X" actually means "value >= X" CWT: Config/triggers_ncns.cwt:396. */
  "collection_size"(value: { "input": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "value": number } | CwtNode): boolean;
  /** Returns true if the specified number of sub-triggers return true. CWT: Config/triggers.cwt:1278. */
  "count_triggers"(value: CwtNode): boolean;
  /** Check if the specified country exist. CWT: Config/triggers.cwt:354. */
  "country_exists"(value: CountryRef): boolean;
  /**  CWT: Config/triggers_gtd.cwt:153. */
  "custom_override_tooltip"(value: CwtNode): boolean;
  /** Works as an and-trigger with a custom tooltip. CWT: Config/triggers.cwt:760. */
  "custom_trigger_tooltip"(value: CwtNode): boolean;
  /** Checks for a specific date. CWT: Config/triggers.cwt:619. */
  "date"(value: string): boolean;
  /** Evaluates a math expression and writes the numeric result to the tooltip. CWT: Config/triggers_taog.cwt:31. */
  "debug_math_expr"(value: CwtNode): boolean;
  /** Check if the difficulty is above or below specified value 0-2 (difficulty enum). Example: difficulty > 0 (above easy). CWT: Config/triggers.cwt:46. */
  "difficulty"(value: number): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:104. */
  "divide_temp_variable"(value: CwtNode): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:128. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): boolean;
  /** Check if division has this battalion in template CWT: Config/triggers_bba.cwt:72. */
  "division_has_battalion_in_template"(value: string): boolean;
  /** Check if division has this battalion as majority in template CWT: Config/triggers_bba.cwt:59. */
  "division_has_majority_template"(value: string): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:28. */
  "else"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:21. */
  "else_if"(value: CwtNode): boolean;
  /** check cost of equipment production line CWT: Config/triggers_gtd.cwt:108. */
  "equipment_cost"(value: CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/triggers.cwt:2006. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/triggers.cwt:1992. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Returns true if all of the active game rule options allow achievements. CWT: Config/triggers.cwt:1758. */
  "game_rules_allow_achievements"(value: true): boolean;
  /** Returns true if the game has any custom difficulty on. CWT: Config/triggers.cwt:1124. */
  "has_any_custom_difficulty_setting"(value: boolean): boolean;
  /** Returns true if the game has the specified custom difficulty on. CWT: Config/triggers.cwt:1120. */
  "has_custom_difficulty_setting"(value: string): boolean;
  /** Checks if player has a DLC. Example: has_dlc = "name of the dlc". CWT: Config/triggers.cwt:176. */
  "has_dlc"(value: string): boolean;
  /** Checks if current scope or global scope has the specified event target saved. CWT: Config/triggers.cwt:1570. */
  "has_event_target"(value: string): boolean;
  /** Checks if a game rule is set to a particular option. CWT: Config/triggers.cwt:1751. */
  "has_game_rule"(value: { "rule": string; "option": string } | CwtNode): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:155. */
  "has_global_flag"(value: string): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:160. */
  "has_global_flag"(value: { "flag": string; "value"?: number; "date"?: string; "days"?: number } | CwtNode): boolean;
  /** checks if division has an officer with the provided name key. CWT: Config/triggers_gtd.cwt:132. */
  "has_officer_name"(value: string): boolean;
  /** Checks if a state contains a railway at or above the specified level. CWT: Config/triggers_nsb.cwt:29. */
  "has_railway_level"(value: { "level": number; "state": StateRef } | CwtNode): boolean;
  /** Compare the initial start date of current game. CWT: Config/triggers.cwt:615. */
  "has_start_date"(value: string): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1550. */
  "has_variable"(value: string): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1554. */
  "has_variable"(value: number): boolean;
  /** Trigger not shown in tooltips. CWT: Config/triggers.cwt:2114. */
  "hidden_trigger"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:14. */
  "if"(value: CwtNode): boolean;
  /** Checks if a the combatant or leader has a border war. CWT: Config/triggers.cwt:1586. */
  "is_border_war"(value: boolean): boolean;
  /** Returns true if game is in debug mode (launched with -debug argument). CWT: Config/triggers_new.cwt:86. */
  "is_debug"(value: boolean): boolean;
  /** Checks if scope leader is from an exiled government. is_exiled_leader = yes. CWT: Config/triggers.cwt:1681. */
  "is_exiled_leader"(value: true): boolean;
  /** Checks if scope leader is from specified exiled government. is_exiled_leader_from = FRA. CWT: Config/triggers.cwt:1700. */
  "is_exiled_leader_from"(value: CountryRef): boolean;
  /** Check if the historical focus is active. CWT: Config/triggers.cwt:992. */
  "is_historical_focus_on"(value: boolean): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1762. */
  "is_in_array"(value: { "array": string | CwtOpaque; "value": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1769. */
  "is_in_array"(value: CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1775. */
  "is_in_array"(value: { "variable_field_32": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Check if current game is ironman. CWT: Config/triggers.cwt:611. */
  "is_ironman"(value: boolean): boolean;
  /** Check if the tutorial is active. CWT: Config/triggers.cwt:988. */
  "is_tutorial"(value: boolean): boolean;
  /** Returns true if this unit's template has the reserves priority CWT: Config/triggers_bba.cwt:187. */
  "is_unit_template_reserves"(value: boolean): boolean;
  /** All inside trigger must be true. At least one entry inside trigger must be true. Negates content of trigger. Print message to game.log - Can be localized. CWT: Config/triggers_new.cwt:15. */
  "log"(value: string): boolean;
  /** Meta triggers can be used for building triggers from strings and running them. following example will test if Germany has 42 pp. CWT: Config/triggers.cwt:1951. */
  "meta_trigger"(value: CwtNode): boolean;
  /** Modulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:161. */
  "modulo_temp_variable"(value: CwtNode): boolean;
  /** Mdulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:167. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:93. */
  "multiply_temp_variable"(value: CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:100. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /**  CWT: Config/scopes.cwt:34. */
  "NOT"(value: CwtNode): boolean;
  /**  CWT: Config/scopes.cwt:42. */
  "OR"(value: CwtNode): boolean;
  /** Compares the amount of turns that have passed during the peace conference with a number. CWT: Config/triggers_bba.cwt:175. */
  "pc_turn"(value: number): boolean;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/triggers.cwt:1635. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:143. */
  "randomize_temp_variable"(value: string): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:147. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1811. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1824. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1833. */
  "remove_from_temp_array"(value: CwtNode): boolean;
  /** Check amount of reserves. CWT: Config/triggers.cwt:76. */
  "reserves"(value: number): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1851. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1863. */
  "resize_temp_array"(value: CwtNode): boolean;
  /** Rounds a temporary variable. CWT: Config/variable_triggers_temp.cwt:200. */
  "round_temp_variable"(value: string): boolean;
  /** Check if the current scope exist. CWT: Config/triggers_gtd.cwt:104. */
  "scope_exists"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:1. */
  "scope_field"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:3. */
  "set_temp_variable"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:38. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:174. */
  "set_temp_variable_to_random"(value: string): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:178. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): boolean;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:82. */
  "subtract_from_temp_variable"(value: CwtNode): boolean;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_triggers_temp.cwt:89. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Check the global threat value. 0-1 value. CWT: Config/triggers.cwt:142. */
  "threat"(value: number): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:706. */
  "tooltip_evaluation"(value: "eval"): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:733. */
  "tooltip_evaluation"(value: "no_eval"): boolean;
  /** Check scope unit organization status 0-1: Example unit_organization < 1 CWT: Config/triggers_bba.cwt:183. */
  "unit_organization"(value: number): boolean;
  /** Check scope unit strength status 0-1: Example unit_strength < 1 CWT: Config/triggers_bba.cwt:179. */
  "unit_strength"(value: number): boolean;
}
export interface GeneratedRaidEffects {
  /** Add divisional commander xp to unit CWT: Config/effects_new.cwt:1018. */
  "add_divisional_commander_xp"(value: number): void;
  /** Adds the specified equipment bonuses to the country. As description the given loc key or the name of given special project will be used. Same usage as in Ideas/National spirits CWT: Config/effects_gtd.cwt:120. */
  "add_equipment_bonus"(value: { "name"?: string; "project"?: CwtOpaque; "bonus": CwtNode } | CwtNode): void;
  /** Adds new namespace. CWT: Config/effects.cwt:761. */
  "add_namespace"(value: string | number | boolean | CountryRef | StateRef): void;
  /** Add history entry to a raid. CWT: Config/effects_gtd.cwt:116. */
  "add_raid_history_entry"(value: boolean): void;
  /** Add efficiency factor to strategic region for from country. CWT: Config/effects.cwt:2342. */
  "add_region_efficiency"(value: "replace_me"): void;
  /** Adds either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:154. */
  "add_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2824. */
  "add_to_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2846. */
  "add_to_array"(value: CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2943. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2965. */
  "add_to_temp_array"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:122. */
  "add_to_temp_variable"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:129. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:67. */
  "add_to_variable"(value: CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:71. */
  "add_to_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Adds victory point to province. CWT: Config/effects_new.cwt:957. */
  "add_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:51. */
  "AND"(value: CwtNode): void;
  /** Boost planning of units that are belongs to the army group/navy of this unit leader. CWT: Config/effects.cwt:2338. */
  "boost_planning"(value: number): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1372. */
  "break"(value: "none"): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1376. */
  "break"(value: true): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:844. */
  "build_railway"(value: { "path": readonly (number)[]; "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:878. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_province": number; "target_province": number; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:915. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_state": StateRef; "target_state": StateRef; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_effects_temp.cwt:242. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): void;
  /** Clamps a variable between two a values or another variables. CWT: Config/variable_effects.cwt:188. */
  "clamp_variable"(value: { "var": CwtOpaque; "min"?: number | string; "max"?: number | string } | CwtNode): void;
  /** Clears the contents of array. CWT: Config/effects.cwt:2907. */
  "clear_array"(value: string | CwtOpaque): void;
  /** Clear a global event target. CWT: Config/effects.cwt:1364. */
  "clear_global_event_target"(value: string): void;
  /** Clear all global event targets. CWT: Config/effects.cwt:1368. */
  "clear_global_event_targets"(value: true): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3016. */
  "clear_temp_array"(value: string): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3019. */
  "clear_temp_array"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:206. */
  "clear_variable"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:210. */
  "clear_variable"(value: CwtOpaque): void;
  /** Clear global flag. CWT: Config/effects.cwt:170. */
  "clr_global_flag"(value: string): void;
  /** Creates a dynamic country and runs child effects on it. CWT: Config/effects_new.cwt:327. */
  "create_dynamic_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Creates an enitity Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. For comparison, default minimum zoom level (closest to the map) is 50 units, while default maximum CWT: Config/effects_nsb.cwt:823. */
  "create_entity"(value: { "entity": string; "id"?: string; "var"?: string; "x"?: number; "y"?: number; "z"?: number; "province"?: number; "state"?: StateRef; "rotation": number; "scale": number; "min_zoom": number; "visible"?: string } | CwtNode): void;
  /** Creates a purchase contract between the countries CWT: Config/effects_aat.cwt:253. */
  "create_purchase_contract"(value: { "seller": CountryRef; "buyer": CountryRef; "civilian_factories": number; "equipment": { "type": string; "amount": number } | CwtNode } | CwtNode): void;
  /** Create railway gun effect CWT: Config/effects_nsb.cwt:713. */
  "create_railway_gun"(value: { "equipment": string; "name"?: string; "location"?: number } | CwtNode): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:14. */
  "custom_effect_tooltip"(value: string): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:17. */
  "custom_effect_tooltip"(value: CwtNode): void;
  /** Executes the provided effects but with a custom tooltip surpressing all tooltips from all other effects inside this block. The custom tooltip is a [bindable localization] CWT: Config/effects_gtd.cwt:318. */
  "custom_override_tooltip"(value: CwtNode): void;
  /** Destroys an existing entity IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:849. */
  "destroy_entity"(value: string): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:155. */
  "divide_temp_variable"(value: CwtNode): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:179. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:91. */
  "divide_variable"(value: CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:116. */
  "divide_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Shows just tooltip of effects. CWT: Config/effects.cwt:1510. */
  "effect_tooltip"(value: CwtNode): void;
  /** Use after (else_)if for a catch-all case. CWT: Config/effects.cwt:431. */
  "else"(value: CwtNode): void;
  /** Use after (else_)if to check other triggers only if first if fails. CWT: Config/effects.cwt:422. */
  "else_if"(value: CwtNode): void;
  /** Shows event option tooltip CWT: Config/effects.cwt:27. */
  "event_option_tooltip"(value: string): void;
  /** - Example *every_collection_element = { limit = { xxx } add_political_power = 1 } - Some collections, like 'country:faction_members', require country scope - Supports 'limit' trigger Applies arbitrary effects to all elements of a collection. Supports both anonymous and regular collections CWT: Config/effects_ncns.cwt:248. */
  "every_collection_element"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfills the "limit" trigger. CWT: Config/effects.cwt:205. */
  "every_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a all countries with original tag. tooltip=key can be defined to override tooltip title. CWT: Config/effects_new.cwt:445. */
  "every_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfils the "limit" trigger. Difference with every_country is that it includes countries not yet present on the map. tooltip=key can be defined to override tooltip title. CWT: Config/effects_nsb.cwt:599. */
  "every_possible_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1067. */
  "every_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/effects.cwt:3261. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/effects.cwt:3247. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array. CWT: Config/effects.cwt:3042. */
  "for_each_loop"(value: CwtNode): void;
  /** Runs a loop on for each element of an array and changes scope to current element in each iteration. CWT: Config/effects.cwt:3068. */
  "for_each_scope_loop"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Runs a same effects through a loop. example will run the effects for value_name = -3, 0, 3, 6, 9 and then terminate. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. Consider using for_each_loop instead. CWT: Config/effects.cwt:3175. */
  "for_loop_effect"(value: CwtNode): void;
  /** Executes children effects on army leaders for every country in the world that fulfills the "limit" trigger. Better to use every_army_leader if you know the country. CWT: Config/effects.cwt:2355. */
  "global_every_army_leader"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Goes to stated province. CWT: Config/effects.cwt:1690. */
  "goto_province"(value: number): void;
  /** Goes to stated state. CWT: Config/effects.cwt:1694. */
  "goto_state"(value: StateRef): void;
  /** Effect not shown in tooltips. CWT: Config/effects.cwt:3783. */
  "hidden_effect"(value: CwtNode): void;
  /** A conditional effect. CWT: Config/effects.cwt:413. */
  "if"(value: CwtNode): void;
  /** Print message to game.log - Can be localized. CWT: Config/effects.cwt:493. */
  "log"(value: string): void;
  /** Meta effects can be used for building effects from strings and running them. following example will give Germany 42 pp. CWT: Config/effects.cwt:3214. */
  "meta_effect"(value: CwtNode): void;
  /** Modify global flag. Only modifies if flag already exists. CWT: Config/effects.cwt:2071. */
  "modify_global_flag"(value: { "flag": string; "value"?: number; "days"?: number } | CwtNode): void;
  /** Modulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:213. */
  "modulo_temp_variable"(value: CwtNode): void;
  /** Mdulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:219. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:155. */
  "modulo_variable"(value: CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:161. */
  "modulo_variable"(value: { "var": CwtOpaque; "value": number } | CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:144. */
  "multiply_temp_variable"(value: CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:151. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:83. */
  "multiply_variable"(value: CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:87. */
  "multiply_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:44. */
  "NOT"(value: CwtNode): void;
  /**  CWT: Config/scopes.cwt:52. */
  "OR"(value: CwtNode): void;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/effects.cwt:2572. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): void;
  /** Promote the officer of the division to a general scope = unit CWT: Config/effects_gtd.cwt:298. */
  "promote_officer_to_general"(value: boolean): void;
  /** Give experience to the units performing the raid (raid instance scope). Will give experience to any type of unit assigned to the raid, e.g. divisions or air wings. The value defines the progress towards the max level, e.g. 0.2 = gain 20% of the experience needed to reach max level. Can use either an CWT: Config/effects_gtd.cwt:294. */
  "raid_add_unit_experience"(value: number): void;
  /** Damage the units performing the raid in scope (the attackers inflict losses). Damage is applied to ground units while damage to plane is defined as the amount of planes lost.\nIf 'ratio = yes', then all damage / losses are applied as a fraction of the current amount. For units, damage can be defined CWT: Config/effects_gtd.cwt:278. */
  "raid_damage_units"(value: { "org_damage"?: number; "str_damage"?: number; "damage"?: number; "plane_loss"?: number; "ratio"?: boolean } | CwtNode): void;
  /** A possible random effect that can occur. CWT: Config/effects.cwt:343. */
  "random"(value: CwtNode): void;
  /** Executes children effects on random country that fulfills the "limit" trigger. CWT: Config/effects.cwt:211. */
  "random_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a random country with original tag. CWT: Config/effects_new.cwt:420. */
  "random_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** A list of possible random effects to trigger in this effect. CWT: Config/effects.cwt:355. */
  "random_list"(value: CwtNode): void;
  /** Runs the effect for a random element in array. CWT: Config/effects.cwt:3082. */
  "random_scope_in_array"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on random state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1049. */
  "random_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:194. */
  "randomize_temp_variable"(value: string): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:198. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:132. */
  "randomize_variable"(value: string): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:136. */
  "randomize_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number | string; "max"?: number | string; "lambda"?: number } | CwtNode): void;
  /** Randomize weather effect. CWT: Config/effects.cwt:570. */
  "randomize_weather"(value: number): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2869. */
  "remove_from_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2884. */
  "remove_from_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2894. */
  "remove_from_array"(value: CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2978. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2993. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:3003. */
  "remove_from_temp_array"(value: CwtNode): void;
  /** Removes either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:164. */
  "remove_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:123. */
  "remove_unit_leader_role"(value: string): void;
  /** Reset name of a province back to localization one. CWT: Config/effects.cwt:2120. */
  "reset_province_name"(value: number): void;
  /** Resizes array. CWT: Config/effects.cwt:2911. */
  "resize_array"(value: { "array": string; "value"?: number | string; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes array. CWT: Config/effects.cwt:2928. */
  "resize_array"(value: CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3023. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3035. */
  "resize_temp_array"(value: CwtNode): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:397. */
  "retire_character"(value: string): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:409. */
  "retire_character"(value: CwtOpaque): void;
  /** Rounds a temporary variable. CWT: Config/variable_effects_temp.cwt:252. */
  "round_temp_variable"(value: string): void;
  /** Rounds a variable. CWT: Config/variable_effects.cwt:202. */
  "round_variable"(value: CwtOpaque): void;
  /** Save an event target. CWT: Config/effects.cwt:1356. */
  "save_event_target_as"(value: string): void;
  /** Save a global event target. CWT: Config/effects.cwt:1360. */
  "save_global_event_target_as"(value: string): void;
  /**  CWT: Config/scopes.cwt:32. */
  "scope_field"(value: CwtNode): void;
  /** Sets the animation of a specified entity IDs are set by the create_entity effect. Animations are defined within the /Hearts of Iron IV/gfx/models/** /*.asset files. CWT: Config/effects_nsb.cwt:903. */
  "set_entity_animation"(value: { "id": string; "animation": string } | CwtNode): void;
  /** Sets the position and rotation of an entity using two coordinates. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:855. */
  "set_entity_movement"(value: { "id": string; "start": { "x": number; "y": number; "z"?: number } | CwtNode; "target": { "province": number } | CwtNode; "ratio": number; "rotation": number } | CwtNode): void;
  /** Sets the position of an existing entity. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. CWT: Config/effects_nsb.cwt:873. */
  "set_entity_position"(value: { "id": string; "x": number; "y": number; "z"?: number; "province": "enum"; "state": StateRef } | CwtNode): void;
  /** Sets the currently-facing angle of an existing entity. IDs are set by the create_entity effect. A positive change results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:887. */
  "set_entity_rotation"(value: { "id": string; "rotation": number } | CwtNode): void;
  /** Sets the size of an existing entity. IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:895. */
  "set_entity_scale"(value: { "id": string; "scale": number } | CwtNode): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:269. */
  "set_faction_military_unlocked"(value: boolean): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:265. */
  "set_faction_research_unlocked"(value: boolean): void;
  /** Set global flag. CWT: Config/effects.cwt:157. */
  "set_global_flag"(value: string): void;
  /** Set global flag. CWT: Config/effects.cwt:160. */
  "set_global_flag"(value: { "flag": string; "value": number; "days"?: number } | CwtNode): void;
  /** Set_province_name = { id = <province id> name = <string> } - Set name for a province. CWT: Config/effects.cwt:2109. */
  "set_province_name"(value: { "id": number; "name": string } | CwtNode): void;
  /** # TEMP VARIABLE Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:53. */
  "set_temp_variable"(value: CwtNode): void;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:88. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:226. */
  "set_temp_variable_to_random"(value: string): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:230. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:3. */
  "set_variable"(value: CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:37. */
  "set_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:168. */
  "set_variable_to_random"(value: string): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:172. */
  "set_variable_to_random"(value: { "var": string; "min"?: number | string; "max"?: number | string; "integer"?: boolean } | CwtNode): void;
  /** Sets victory point to province. CWT: Config/effects_new.cwt:964. */
  "set_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /** Plays sound effect. CWT: Config/effects.cwt:562. */
  "sound_effect"(value: string): void;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:133. */
  "subtract_from_temp_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_effects_temp.cwt:140. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:75. */
  "subtract_from_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:79. */
  "subtract_from_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /**  CWT: Config/effects.cwt:1381. */
  "unlock_national_focus"(value: string): void;
  /** Runs the effect as long as a trigger is true. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. CWT: Config/effects.cwt:3200. */
  "while_loop_effect"(value: CwtNode): void;
}
export interface GeneratedRaidTriggers {
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1781. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef; "index"?: "int_variable_field_32" } | CwtNode): boolean;
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1800. */
  "add_to_temp_array"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:71. */
  "add_to_temp_variable"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:78. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { all_collection_elements = { ``` Example (anonymous collection): Example: *all_collection_elements = { coll CWT: Config/triggers_ncns.cwt:151. */
  "all_collection_elements"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all countries meets the trigger. CWT: Config/triggers.cwt:223. */
  "all_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if all of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:507. */
  "all_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if all country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:195. */
  "all_country_with_original_tag"(value: CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1887. */
  "all_of"(value: CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1918. */
  "all_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all states meets the trigger. CWT: Config/triggers.cwt:525. */
  "all_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Always returns specified value. CWT: Config/triggers.cwt:146. */
  "always"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:41. */
  "AND"(value: CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { any_collection_element = { ``` Example (anonymous collection): Example: *any_collection_element = { collec CWT: Config/triggers_ncns.cwt:124. */
  "any_collection_element"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any country meets the trigger. CWT: Config/triggers.cwt:89. */
  "any_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:533. */
  "any_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:182. */
  "any_country_with_original_tag"(value: CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:552. */
  "any_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1871. */
  "any_of"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1908. */
  "any_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any other country meets the trigger. Excludes current country. CWT: Config/triggers.cwt:1095. */
  "any_other_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries (except for the current country) fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:571. */
  "any_other_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries and isn't the current country fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:590. */
  "any_other_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any state meets the trigger. CWT: Config/triggers.cwt:505. */
  "any_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** check if any state in the given category meets the trigger. CWT: Config/triggers_gtd.cwt:84. */
  "any_state_in"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Checks if any of the provided states fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:482. */
  "any_state_of"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Evaluates a math expression and returns true when the result is non-zero. CWT: Config/triggers_taog.cwt:57. */
  "check_expr"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:93. */
  "check_variable"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:105. */
  "check_variable"(value: { "var": string | number | boolean | CountryRef | StateRef; "value": string | number | boolean | CountryRef | StateRef; "compare"?: string; "tooltip"?: string } | CwtNode): boolean;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_triggers_temp.cwt:190. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1844. */
  "clear_temp_array"(value: string | CwtOpaque): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1847. */
  "clear_temp_array"(value: number): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:167. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "country": CountryRef } | CwtNode): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:186. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "countries": readonly (CountryRef)[] } | CwtNode): boolean;
  /** - Example: *collection_size = { input = collection:my_awesome_collection value > 1 }* - Variables can be used - Multiple comparisons are allowed: value > x value < y - Supported operators: <, >, = (THIS IS NOT TRUE AS OF 1.17.0.7) - Comparison is inclusive, so "value > X" actually means "value >= X" CWT: Config/triggers_ncns.cwt:396. */
  "collection_size"(value: { "input": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "value": number } | CwtNode): boolean;
  /** Returns true if the specified number of sub-triggers return true. CWT: Config/triggers.cwt:1278. */
  "count_triggers"(value: CwtNode): boolean;
  /** Check if the specified country exist. CWT: Config/triggers.cwt:354. */
  "country_exists"(value: CountryRef): boolean;
  /**  CWT: Config/triggers_gtd.cwt:153. */
  "custom_override_tooltip"(value: CwtNode): boolean;
  /** Works as an and-trigger with a custom tooltip. CWT: Config/triggers.cwt:760. */
  "custom_trigger_tooltip"(value: CwtNode): boolean;
  /** Checks for a specific date. CWT: Config/triggers.cwt:619. */
  "date"(value: string): boolean;
  /** Evaluates a math expression and writes the numeric result to the tooltip. CWT: Config/triggers_taog.cwt:31. */
  "debug_math_expr"(value: CwtNode): boolean;
  /** Check if the difficulty is above or below specified value 0-2 (difficulty enum). Example: difficulty > 0 (above easy). CWT: Config/triggers.cwt:46. */
  "difficulty"(value: number): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:104. */
  "divide_temp_variable"(value: CwtNode): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:128. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:28. */
  "else"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:21. */
  "else_if"(value: CwtNode): boolean;
  /** check cost of equipment production line CWT: Config/triggers_gtd.cwt:108. */
  "equipment_cost"(value: CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/triggers.cwt:2006. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/triggers.cwt:1992. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Returns true if all of the active game rule options allow achievements. CWT: Config/triggers.cwt:1758. */
  "game_rules_allow_achievements"(value: true): boolean;
  /** Returns true if the game has any custom difficulty on. CWT: Config/triggers.cwt:1124. */
  "has_any_custom_difficulty_setting"(value: boolean): boolean;
  /** Returns true if the game has the specified custom difficulty on. CWT: Config/triggers.cwt:1120. */
  "has_custom_difficulty_setting"(value: string): boolean;
  /** Checks if player has a DLC. Example: has_dlc = "name of the dlc". CWT: Config/triggers.cwt:176. */
  "has_dlc"(value: string): boolean;
  /** Checks if current scope or global scope has the specified event target saved. CWT: Config/triggers.cwt:1570. */
  "has_event_target"(value: string): boolean;
  /** Checks if a game rule is set to a particular option. CWT: Config/triggers.cwt:1751. */
  "has_game_rule"(value: { "rule": string; "option": string } | CwtNode): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:155. */
  "has_global_flag"(value: string): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:160. */
  "has_global_flag"(value: { "flag": string; "value"?: number; "date"?: string; "days"?: number } | CwtNode): boolean;
  /** Checks if a state contains a railway at or above the specified level. CWT: Config/triggers_nsb.cwt:29. */
  "has_railway_level"(value: { "level": number; "state": StateRef } | CwtNode): boolean;
  /** Compare the initial start date of current game. CWT: Config/triggers.cwt:615. */
  "has_start_date"(value: string): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1550. */
  "has_variable"(value: string): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1554. */
  "has_variable"(value: number): boolean;
  /** Trigger not shown in tooltips. CWT: Config/triggers.cwt:2114. */
  "hidden_trigger"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:14. */
  "if"(value: CwtNode): boolean;
  /** Checks if a the combatant or leader has a border war. CWT: Config/triggers.cwt:1586. */
  "is_border_war"(value: boolean): boolean;
  /** Returns true if game is in debug mode (launched with -debug argument). CWT: Config/triggers_new.cwt:86. */
  "is_debug"(value: boolean): boolean;
  /** Checks if scope leader is from an exiled government. is_exiled_leader = yes. CWT: Config/triggers.cwt:1681. */
  "is_exiled_leader"(value: true): boolean;
  /** Checks if scope leader is from specified exiled government. is_exiled_leader_from = FRA. CWT: Config/triggers.cwt:1700. */
  "is_exiled_leader_from"(value: CountryRef): boolean;
  /** Check if the historical focus is active. CWT: Config/triggers.cwt:992. */
  "is_historical_focus_on"(value: boolean): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1762. */
  "is_in_array"(value: { "array": string | CwtOpaque; "value": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1769. */
  "is_in_array"(value: CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1775. */
  "is_in_array"(value: { "variable_field_32": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Check if current game is ironman. CWT: Config/triggers.cwt:611. */
  "is_ironman"(value: boolean): boolean;
  /** Check if the tutorial is active. CWT: Config/triggers.cwt:988. */
  "is_tutorial"(value: boolean): boolean;
  /** All inside trigger must be true. At least one entry inside trigger must be true. Negates content of trigger. Print message to game.log - Can be localized. CWT: Config/triggers_new.cwt:15. */
  "log"(value: string): boolean;
  /** Meta triggers can be used for building triggers from strings and running them. following example will test if Germany has 42 pp. CWT: Config/triggers.cwt:1951. */
  "meta_trigger"(value: CwtNode): boolean;
  /** Modulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:161. */
  "modulo_temp_variable"(value: CwtNode): boolean;
  /** Mdulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:167. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:93. */
  "multiply_temp_variable"(value: CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:100. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /**  CWT: Config/scopes.cwt:34. */
  "NOT"(value: CwtNode): boolean;
  /**  CWT: Config/scopes.cwt:42. */
  "OR"(value: CwtNode): boolean;
  /** Compares the amount of turns that have passed during the peace conference with a number. CWT: Config/triggers_bba.cwt:175. */
  "pc_turn"(value: number): boolean;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/triggers.cwt:1635. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:143. */
  "randomize_temp_variable"(value: string): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:147. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1811. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1824. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1833. */
  "remove_from_temp_array"(value: CwtNode): boolean;
  /** Check amount of reserves. CWT: Config/triggers.cwt:76. */
  "reserves"(value: number): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1851. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1863. */
  "resize_temp_array"(value: CwtNode): boolean;
  /** Rounds a temporary variable. CWT: Config/variable_triggers_temp.cwt:200. */
  "round_temp_variable"(value: string): boolean;
  /** Check if the current scope exist. CWT: Config/triggers_gtd.cwt:104. */
  "scope_exists"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:1. */
  "scope_field"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:3. */
  "set_temp_variable"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:38. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:174. */
  "set_temp_variable_to_random"(value: string): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:178. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): boolean;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:82. */
  "subtract_from_temp_variable"(value: CwtNode): boolean;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_triggers_temp.cwt:89. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Check the global threat value. 0-1 value. CWT: Config/triggers.cwt:142. */
  "threat"(value: number): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:706. */
  "tooltip_evaluation"(value: "eval"): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:733. */
  "tooltip_evaluation"(value: "no_eval"): boolean;
}
export interface GeneratedOperationEffects {
  /** Add divisional commander xp to unit CWT: Config/effects_new.cwt:1018. */
  "add_divisional_commander_xp"(value: number): void;
  /** Adds the specified equipment bonuses to the country. As description the given loc key or the name of given special project will be used. Same usage as in Ideas/National spirits CWT: Config/effects_gtd.cwt:120. */
  "add_equipment_bonus"(value: { "name"?: string; "project"?: CwtOpaque; "bonus": CwtNode } | CwtNode): void;
  /** Adds new namespace. CWT: Config/effects.cwt:761. */
  "add_namespace"(value: string | number | boolean | CountryRef | StateRef): void;
  /** Add efficiency factor to strategic region for from country. CWT: Config/effects.cwt:2342. */
  "add_region_efficiency"(value: "replace_me"): void;
  /** Adds either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:154. */
  "add_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2824. */
  "add_to_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2846. */
  "add_to_array"(value: CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2943. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2965. */
  "add_to_temp_array"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:122. */
  "add_to_temp_variable"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:129. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:67. */
  "add_to_variable"(value: CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:71. */
  "add_to_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Adds victory point to province. CWT: Config/effects_new.cwt:957. */
  "add_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:51. */
  "AND"(value: CwtNode): void;
  /** Boost planning of units that are belongs to the army group/navy of this unit leader. CWT: Config/effects.cwt:2338. */
  "boost_planning"(value: number): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1372. */
  "break"(value: "none"): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1376. */
  "break"(value: true): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:844. */
  "build_railway"(value: { "path": readonly (number)[]; "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:878. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_province": number; "target_province": number; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:915. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_state": StateRef; "target_state": StateRef; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_effects_temp.cwt:242. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): void;
  /** Clamps a variable between two a values or another variables. CWT: Config/variable_effects.cwt:188. */
  "clamp_variable"(value: { "var": CwtOpaque; "min"?: number | string; "max"?: number | string } | CwtNode): void;
  /** Clears the contents of array. CWT: Config/effects.cwt:2907. */
  "clear_array"(value: string | CwtOpaque): void;
  /** Clear a global event target. CWT: Config/effects.cwt:1364. */
  "clear_global_event_target"(value: string): void;
  /** Clear all global event targets. CWT: Config/effects.cwt:1368. */
  "clear_global_event_targets"(value: true): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3016. */
  "clear_temp_array"(value: string): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3019. */
  "clear_temp_array"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:206. */
  "clear_variable"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:210. */
  "clear_variable"(value: CwtOpaque): void;
  /** Clear global flag. CWT: Config/effects.cwt:170. */
  "clr_global_flag"(value: string): void;
  /** Creates a dynamic country and runs child effects on it. CWT: Config/effects_new.cwt:327. */
  "create_dynamic_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Creates an enitity Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. For comparison, default minimum zoom level (closest to the map) is 50 units, while default maximum CWT: Config/effects_nsb.cwt:823. */
  "create_entity"(value: { "entity": string; "id"?: string; "var"?: string; "x"?: number; "y"?: number; "z"?: number; "province"?: number; "state"?: StateRef; "rotation": number; "scale": number; "min_zoom": number; "visible"?: string } | CwtNode): void;
  /** Creates a purchase contract between the countries CWT: Config/effects_aat.cwt:253. */
  "create_purchase_contract"(value: { "seller": CountryRef; "buyer": CountryRef; "civilian_factories": number; "equipment": { "type": string; "amount": number } | CwtNode } | CwtNode): void;
  /** Create railway gun effect CWT: Config/effects_nsb.cwt:713. */
  "create_railway_gun"(value: { "equipment": string; "name"?: string; "location"?: number } | CwtNode): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:14. */
  "custom_effect_tooltip"(value: string): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:17. */
  "custom_effect_tooltip"(value: CwtNode): void;
  /** Executes the provided effects but with a custom tooltip surpressing all tooltips from all other effects inside this block. The custom tooltip is a [bindable localization] CWT: Config/effects_gtd.cwt:318. */
  "custom_override_tooltip"(value: CwtNode): void;
  /** Destroys an existing entity IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:849. */
  "destroy_entity"(value: string): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:155. */
  "divide_temp_variable"(value: CwtNode): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:179. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:91. */
  "divide_variable"(value: CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:116. */
  "divide_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Shows just tooltip of effects. CWT: Config/effects.cwt:1510. */
  "effect_tooltip"(value: CwtNode): void;
  /** Use after (else_)if for a catch-all case. CWT: Config/effects.cwt:431. */
  "else"(value: CwtNode): void;
  /** Use after (else_)if to check other triggers only if first if fails. CWT: Config/effects.cwt:422. */
  "else_if"(value: CwtNode): void;
  /** Shows event option tooltip CWT: Config/effects.cwt:27. */
  "event_option_tooltip"(value: string): void;
  /** - Example *every_collection_element = { limit = { xxx } add_political_power = 1 } - Some collections, like 'country:faction_members', require country scope - Supports 'limit' trigger Applies arbitrary effects to all elements of a collection. Supports both anonymous and regular collections CWT: Config/effects_ncns.cwt:248. */
  "every_collection_element"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfills the "limit" trigger. CWT: Config/effects.cwt:205. */
  "every_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a all countries with original tag. tooltip=key can be defined to override tooltip title. CWT: Config/effects_new.cwt:445. */
  "every_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on operatives that fulfils the "limit" trigger. tooltip=key can be added to override tooltip title CWT: Config/effects_new.cwt:139. */
  "every_operative"(value: Effect<ScopeByName["operative"]> | { limit?: Trigger<ScopeByName["operative"]>; effects: Effect<ScopeByName["operative"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfils the "limit" trigger. Difference with every_country is that it includes countries not yet present on the map. tooltip=key can be defined to override tooltip title. CWT: Config/effects_nsb.cwt:599. */
  "every_possible_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1067. */
  "every_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Special effect for executing the Coordinated Strike Operation. Amount determines how often the simulation is run. CWT: Config/effects_new.cwt:848. */
  "execute_operation_coordinated_strike"(value: { "amount": number } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/effects.cwt:3261. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/effects.cwt:3247. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array. CWT: Config/effects.cwt:3042. */
  "for_each_loop"(value: CwtNode): void;
  /** Runs a loop on for each element of an array and changes scope to current element in each iteration. CWT: Config/effects.cwt:3068. */
  "for_each_scope_loop"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Runs a same effects through a loop. example will run the effects for value_name = -3, 0, 3, 6, 9 and then terminate. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. Consider using for_each_loop instead. CWT: Config/effects.cwt:3175. */
  "for_loop_effect"(value: CwtNode): void;
  /** Executes children effects on army leaders for every country in the world that fulfills the "limit" trigger. Better to use every_army_leader if you know the country. CWT: Config/effects.cwt:2355. */
  "global_every_army_leader"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Goes to stated province. CWT: Config/effects.cwt:1690. */
  "goto_province"(value: number): void;
  /** Goes to stated state. CWT: Config/effects.cwt:1694. */
  "goto_state"(value: StateRef): void;
  /** Effect not shown in tooltips. CWT: Config/effects.cwt:3783. */
  "hidden_effect"(value: CwtNode): void;
  /** A conditional effect. CWT: Config/effects.cwt:413. */
  "if"(value: CwtNode): void;
  /** Print message to game.log - Can be localized. CWT: Config/effects.cwt:493. */
  "log"(value: string): void;
  /** Meta effects can be used for building effects from strings and running them. following example will give Germany 42 pp. CWT: Config/effects.cwt:3214. */
  "meta_effect"(value: CwtNode): void;
  /** Modify global flag. Only modifies if flag already exists. CWT: Config/effects.cwt:2071. */
  "modify_global_flag"(value: { "flag": string; "value"?: number; "days"?: number } | CwtNode): void;
  /** Modulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:213. */
  "modulo_temp_variable"(value: CwtNode): void;
  /** Mdulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:219. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:155. */
  "modulo_variable"(value: CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:161. */
  "modulo_variable"(value: { "var": CwtOpaque; "value": number } | CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:144. */
  "multiply_temp_variable"(value: CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:151. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:83. */
  "multiply_variable"(value: CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:87. */
  "multiply_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:44. */
  "NOT"(value: CwtNode): void;
  /**  CWT: Config/scopes.cwt:52. */
  "OR"(value: CwtNode): void;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/effects.cwt:2572. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): void;
  /** Promote the officer of the division to a general scope = unit CWT: Config/effects_gtd.cwt:298. */
  "promote_officer_to_general"(value: boolean): void;
  /** A possible random effect that can occur. CWT: Config/effects.cwt:343. */
  "random"(value: CwtNode): void;
  /** Executes children effects on random country that fulfills the "limit" trigger. CWT: Config/effects.cwt:211. */
  "random_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a random country with original tag. CWT: Config/effects_new.cwt:420. */
  "random_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** A list of possible random effects to trigger in this effect. CWT: Config/effects.cwt:355. */
  "random_list"(value: CwtNode): void;
  /** Executes children effects on a random operatives that fulfils the "limit" trigger. CWT: Config/effects_new.cwt:133. */
  "random_operative"(value: Effect<ScopeByName["operative"]> | { limit?: Trigger<ScopeByName["operative"]>; effects: Effect<ScopeByName["operative"]> } | CwtNode): void;
  /** Runs the effect for a random element in array. CWT: Config/effects.cwt:3082. */
  "random_scope_in_array"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on random state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1049. */
  "random_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:194. */
  "randomize_temp_variable"(value: string): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:198. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:132. */
  "randomize_variable"(value: string): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:136. */
  "randomize_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number | string; "max"?: number | string; "lambda"?: number } | CwtNode): void;
  /** Randomize weather effect. CWT: Config/effects.cwt:570. */
  "randomize_weather"(value: number): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2869. */
  "remove_from_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2884. */
  "remove_from_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2894. */
  "remove_from_array"(value: CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2978. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2993. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:3003. */
  "remove_from_temp_array"(value: CwtNode): void;
  /** Removes either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:164. */
  "remove_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:123. */
  "remove_unit_leader_role"(value: string): void;
  /** Reset name of a province back to localization one. CWT: Config/effects.cwt:2120. */
  "reset_province_name"(value: number): void;
  /** Resizes array. CWT: Config/effects.cwt:2911. */
  "resize_array"(value: { "array": string; "value"?: number | string; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes array. CWT: Config/effects.cwt:2928. */
  "resize_array"(value: CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3023. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3035. */
  "resize_temp_array"(value: CwtNode): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:397. */
  "retire_character"(value: string): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:409. */
  "retire_character"(value: CwtOpaque): void;
  /** Rounds a temporary variable. CWT: Config/variable_effects_temp.cwt:252. */
  "round_temp_variable"(value: string): void;
  /** Rounds a variable. CWT: Config/variable_effects.cwt:202. */
  "round_variable"(value: CwtOpaque): void;
  /** Save an event target. CWT: Config/effects.cwt:1356. */
  "save_event_target_as"(value: string): void;
  /** Save a global event target. CWT: Config/effects.cwt:1360. */
  "save_global_event_target_as"(value: string): void;
  /**  CWT: Config/scopes.cwt:32. */
  "scope_field"(value: CwtNode): void;
  /** Sets the animation of a specified entity IDs are set by the create_entity effect. Animations are defined within the /Hearts of Iron IV/gfx/models/** /*.asset files. CWT: Config/effects_nsb.cwt:903. */
  "set_entity_animation"(value: { "id": string; "animation": string } | CwtNode): void;
  /** Sets the position and rotation of an entity using two coordinates. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:855. */
  "set_entity_movement"(value: { "id": string; "start": { "x": number; "y": number; "z"?: number } | CwtNode; "target": { "province": number } | CwtNode; "ratio": number; "rotation": number } | CwtNode): void;
  /** Sets the position of an existing entity. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. CWT: Config/effects_nsb.cwt:873. */
  "set_entity_position"(value: { "id": string; "x": number; "y": number; "z"?: number; "province": "enum"; "state": StateRef } | CwtNode): void;
  /** Sets the currently-facing angle of an existing entity. IDs are set by the create_entity effect. A positive change results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:887. */
  "set_entity_rotation"(value: { "id": string; "rotation": number } | CwtNode): void;
  /** Sets the size of an existing entity. IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:895. */
  "set_entity_scale"(value: { "id": string; "scale": number } | CwtNode): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:269. */
  "set_faction_military_unlocked"(value: boolean): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:265. */
  "set_faction_research_unlocked"(value: boolean): void;
  /** Set global flag. CWT: Config/effects.cwt:157. */
  "set_global_flag"(value: string): void;
  /** Set global flag. CWT: Config/effects.cwt:160. */
  "set_global_flag"(value: { "flag": string; "value": number; "days"?: number } | CwtNode): void;
  /** Set_province_name = { id = <province id> name = <string> } - Set name for a province. CWT: Config/effects.cwt:2109. */
  "set_province_name"(value: { "id": number; "name": string } | CwtNode): void;
  /** # TEMP VARIABLE Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:53. */
  "set_temp_variable"(value: CwtNode): void;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:88. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:226. */
  "set_temp_variable_to_random"(value: string): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:230. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:3. */
  "set_variable"(value: CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:37. */
  "set_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:168. */
  "set_variable_to_random"(value: string): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:172. */
  "set_variable_to_random"(value: { "var": string; "min"?: number | string; "max"?: number | string; "integer"?: boolean } | CwtNode): void;
  /** Sets victory point to province. CWT: Config/effects_new.cwt:964. */
  "set_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /** Plays sound effect. CWT: Config/effects.cwt:562. */
  "sound_effect"(value: string): void;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:133. */
  "subtract_from_temp_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_effects_temp.cwt:140. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:75. */
  "subtract_from_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:79. */
  "subtract_from_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /**  CWT: Config/effects.cwt:1381. */
  "unlock_national_focus"(value: string): void;
  /** Runs the effect as long as a trigger is true. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. CWT: Config/effects.cwt:3200. */
  "while_loop_effect"(value: CwtNode): void;
}
export interface GeneratedOperationTriggers {
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1781. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef; "index"?: "int_variable_field_32" } | CwtNode): boolean;
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1800. */
  "add_to_temp_array"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:71. */
  "add_to_temp_variable"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:78. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { all_collection_elements = { ``` Example (anonymous collection): Example: *all_collection_elements = { coll CWT: Config/triggers_ncns.cwt:151. */
  "all_collection_elements"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all countries meets the trigger. CWT: Config/triggers.cwt:223. */
  "all_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if all of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:507. */
  "all_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if all country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:195. */
  "all_country_with_original_tag"(value: CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1887. */
  "all_of"(value: CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1918. */
  "all_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all operatives meets the trigger. tooltip=key can be defined to override title. CWT: Config/triggers_new.cwt:245. */
  "all_operative_leader"(value: Trigger<ScopeByName["operative"]> | CwtNode): boolean;
  /** Check if all states meets the trigger. CWT: Config/triggers.cwt:525. */
  "all_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Always returns specified value. CWT: Config/triggers.cwt:146. */
  "always"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:41. */
  "AND"(value: CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { any_collection_element = { ``` Example (anonymous collection): Example: *any_collection_element = { collec CWT: Config/triggers_ncns.cwt:124. */
  "any_collection_element"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any country meets the trigger. CWT: Config/triggers.cwt:89. */
  "any_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:533. */
  "any_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:182. */
  "any_country_with_original_tag"(value: CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:552. */
  "any_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1871. */
  "any_of"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1908. */
  "any_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any operatives meets the trigger. tooltip=key can be defined to override title. CWT: Config/triggers_new.cwt:250. */
  "any_operative_leader"(value: Trigger<ScopeByName["operative"]> | CwtNode): boolean;
  /** Check if any other country meets the trigger. Excludes current country. CWT: Config/triggers.cwt:1095. */
  "any_other_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries (except for the current country) fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:571. */
  "any_other_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries and isn't the current country fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:590. */
  "any_other_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any state meets the trigger. CWT: Config/triggers.cwt:505. */
  "any_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** check if any state in the given category meets the trigger. CWT: Config/triggers_gtd.cwt:84. */
  "any_state_in"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Checks if any of the provided states fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:482. */
  "any_state_of"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Evaluates a math expression and returns true when the result is non-zero. CWT: Config/triggers_taog.cwt:57. */
  "check_expr"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:93. */
  "check_variable"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:105. */
  "check_variable"(value: { "var": string | number | boolean | CountryRef | StateRef; "value": string | number | boolean | CountryRef | StateRef; "compare"?: string; "tooltip"?: string } | CwtNode): boolean;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_triggers_temp.cwt:190. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1844. */
  "clear_temp_array"(value: string | CwtOpaque): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1847. */
  "clear_temp_array"(value: number): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:167. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "country": CountryRef } | CwtNode): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:186. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "countries": readonly (CountryRef)[] } | CwtNode): boolean;
  /** - Example: *collection_size = { input = collection:my_awesome_collection value > 1 }* - Variables can be used - Multiple comparisons are allowed: value > x value < y - Supported operators: <, >, = (THIS IS NOT TRUE AS OF 1.17.0.7) - Comparison is inclusive, so "value > X" actually means "value >= X" CWT: Config/triggers_ncns.cwt:396. */
  "collection_size"(value: { "input": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "value": number } | CwtNode): boolean;
  /** Returns true if the specified number of sub-triggers return true. CWT: Config/triggers.cwt:1278. */
  "count_triggers"(value: CwtNode): boolean;
  /** Check if the specified country exist. CWT: Config/triggers.cwt:354. */
  "country_exists"(value: CountryRef): boolean;
  /**  CWT: Config/triggers_gtd.cwt:153. */
  "custom_override_tooltip"(value: CwtNode): boolean;
  /** Works as an and-trigger with a custom tooltip. CWT: Config/triggers.cwt:760. */
  "custom_trigger_tooltip"(value: CwtNode): boolean;
  /** Checks for a specific date. CWT: Config/triggers.cwt:619. */
  "date"(value: string): boolean;
  /** Evaluates a math expression and writes the numeric result to the tooltip. CWT: Config/triggers_taog.cwt:31. */
  "debug_math_expr"(value: CwtNode): boolean;
  /** Check if the difficulty is above or below specified value 0-2 (difficulty enum). Example: difficulty > 0 (above easy). CWT: Config/triggers.cwt:46. */
  "difficulty"(value: number): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:104. */
  "divide_temp_variable"(value: CwtNode): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:128. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:28. */
  "else"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:21. */
  "else_if"(value: CwtNode): boolean;
  /** check cost of equipment production line CWT: Config/triggers_gtd.cwt:108. */
  "equipment_cost"(value: CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/triggers.cwt:2006. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/triggers.cwt:1992. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Returns true if all of the active game rule options allow achievements. CWT: Config/triggers.cwt:1758. */
  "game_rules_allow_achievements"(value: true): boolean;
  /** Returns true if the game has any custom difficulty on. CWT: Config/triggers.cwt:1124. */
  "has_any_custom_difficulty_setting"(value: boolean): boolean;
  /** Returns true if the game has the specified custom difficulty on. CWT: Config/triggers.cwt:1120. */
  "has_custom_difficulty_setting"(value: string): boolean;
  /** Checks if player has a DLC. Example: has_dlc = "name of the dlc". CWT: Config/triggers.cwt:176. */
  "has_dlc"(value: string): boolean;
  /** Checks if current scope or global scope has the specified event target saved. CWT: Config/triggers.cwt:1570. */
  "has_event_target"(value: string): boolean;
  /** Checks if a game rule is set to a particular option. CWT: Config/triggers.cwt:1751. */
  "has_game_rule"(value: { "rule": string; "option": string } | CwtNode): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:155. */
  "has_global_flag"(value: string): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:160. */
  "has_global_flag"(value: { "flag": string; "value"?: number; "date"?: string; "days"?: number } | CwtNode): boolean;
  /** Checks if a state contains a railway at or above the specified level. CWT: Config/triggers_nsb.cwt:29. */
  "has_railway_level"(value: { "level": number; "state": StateRef } | CwtNode): boolean;
  /** Compare the initial start date of current game. CWT: Config/triggers.cwt:615. */
  "has_start_date"(value: string): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1550. */
  "has_variable"(value: string): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1554. */
  "has_variable"(value: number): boolean;
  /** Trigger not shown in tooltips. CWT: Config/triggers.cwt:2114. */
  "hidden_trigger"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:14. */
  "if"(value: CwtNode): boolean;
  /** Checks if a the combatant or leader has a border war. CWT: Config/triggers.cwt:1586. */
  "is_border_war"(value: boolean): boolean;
  /** Returns true if game is in debug mode (launched with -debug argument). CWT: Config/triggers_new.cwt:86. */
  "is_debug"(value: boolean): boolean;
  /** Checks if scope leader is from an exiled government. is_exiled_leader = yes. CWT: Config/triggers.cwt:1681. */
  "is_exiled_leader"(value: true): boolean;
  /** Checks if scope leader is from specified exiled government. is_exiled_leader_from = FRA. CWT: Config/triggers.cwt:1700. */
  "is_exiled_leader_from"(value: CountryRef): boolean;
  /** Check if the historical focus is active. CWT: Config/triggers.cwt:992. */
  "is_historical_focus_on"(value: boolean): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1762. */
  "is_in_array"(value: { "array": string | CwtOpaque; "value": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1769. */
  "is_in_array"(value: CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1775. */
  "is_in_array"(value: { "variable_field_32": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Check if current game is ironman. CWT: Config/triggers.cwt:611. */
  "is_ironman"(value: boolean): boolean;
  /** Checks the type of operation. CWT: Config/triggers_new.cwt:379. */
  "is_operation_type"(value: string): boolean;
  /** Check if the tutorial is active. CWT: Config/triggers.cwt:988. */
  "is_tutorial"(value: boolean): boolean;
  /** All inside trigger must be true. At least one entry inside trigger must be true. Negates content of trigger. Print message to game.log - Can be localized. CWT: Config/triggers_new.cwt:15. */
  "log"(value: string): boolean;
  /** Meta triggers can be used for building triggers from strings and running them. following example will test if Germany has 42 pp. CWT: Config/triggers.cwt:1951. */
  "meta_trigger"(value: CwtNode): boolean;
  /** Modulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:161. */
  "modulo_temp_variable"(value: CwtNode): boolean;
  /** Mdulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:167. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:93. */
  "multiply_temp_variable"(value: CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:100. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /**  CWT: Config/scopes.cwt:34. */
  "NOT"(value: CwtNode): boolean;
  /**  CWT: Config/scopes.cwt:42. */
  "OR"(value: CwtNode): boolean;
  /** Compares the amount of turns that have passed during the peace conference with a number. CWT: Config/triggers_bba.cwt:175. */
  "pc_turn"(value: number): boolean;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/triggers.cwt:1635. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:143. */
  "randomize_temp_variable"(value: string): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:147. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1811. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1824. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1833. */
  "remove_from_temp_array"(value: CwtNode): boolean;
  /** Check amount of reserves. CWT: Config/triggers.cwt:76. */
  "reserves"(value: number): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1851. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1863. */
  "resize_temp_array"(value: CwtNode): boolean;
  /** Rounds a temporary variable. CWT: Config/variable_triggers_temp.cwt:200. */
  "round_temp_variable"(value: string): boolean;
  /** Check if the current scope exist. CWT: Config/triggers_gtd.cwt:104. */
  "scope_exists"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:1. */
  "scope_field"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:3. */
  "set_temp_variable"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:38. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:174. */
  "set_temp_variable_to_random"(value: string): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:178. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): boolean;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:82. */
  "subtract_from_temp_variable"(value: CwtNode): boolean;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_triggers_temp.cwt:89. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Check the global threat value. 0-1 value. CWT: Config/triggers.cwt:142. */
  "threat"(value: number): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:706. */
  "tooltip_evaluation"(value: "eval"): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:733. */
  "tooltip_evaluation"(value: "no_eval"): boolean;
}
export interface GeneratedAnyEffects {
  /** Add divisional commander xp to unit CWT: Config/effects_new.cwt:1018. */
  "add_divisional_commander_xp"(value: number): void;
  /** Adds the specified equipment bonuses to the country. As description the given loc key or the name of given special project will be used. Same usage as in Ideas/National spirits CWT: Config/effects_gtd.cwt:120. */
  "add_equipment_bonus"(value: { "name"?: string; "project"?: CwtOpaque; "bonus": CwtNode } | CwtNode): void;
  /** Adds new namespace. CWT: Config/effects.cwt:761. */
  "add_namespace"(value: string | number | boolean | CountryRef | StateRef): void;
  /** Add efficiency factor to strategic region for from country. CWT: Config/effects.cwt:2342. */
  "add_region_efficiency"(value: "replace_me"): void;
  /** Adds either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:154. */
  "add_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2824. */
  "add_to_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to an array. CWT: Config/effects.cwt:2846. */
  "add_to_array"(value: CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2943. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef | string; "index"?: "int_variable_field_32" } | CwtNode): void;
  /** Adds an element to a temporary array. CWT: Config/effects.cwt:2965. */
  "add_to_temp_array"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:122. */
  "add_to_temp_variable"(value: CwtNode): void;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:129. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:67. */
  "add_to_variable"(value: CwtNode): void;
  /** Adds a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:71. */
  "add_to_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Adds victory point to province. CWT: Config/effects_new.cwt:957. */
  "add_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:51. */
  "AND"(value: CwtNode): void;
  /** Boost planning of units that are belongs to the army group/navy of this unit leader. CWT: Config/effects.cwt:2338. */
  "boost_planning"(value: number): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1372. */
  "break"(value: "none"): void;
  /** Break execution of effects. CWT: Config/effects.cwt:1376. */
  "break"(value: true): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:844. */
  "build_railway"(value: { "path": readonly (number)[]; "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:878. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_province": number; "target_province": number; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Starts railway construction for amount of levels in specified state or province. CWT: Config/effects.cwt:915. */
  "build_railway"(value: { "build_only_on_allied"?: boolean; "controller_priority"?: { "base"?: number; "modifier"?: { "tag": CountryRef; "add": number } | CwtNode } | CwtNode; "level"?: number; "start_state": StateRef; "target_state": StateRef; "path"?: readonly (number)[]; "fallback"?: boolean } | CwtNode): void;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_effects_temp.cwt:242. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): void;
  /** Clamps a variable between two a values or another variables. CWT: Config/variable_effects.cwt:188. */
  "clamp_variable"(value: { "var": CwtOpaque; "min"?: number | string; "max"?: number | string } | CwtNode): void;
  /** Clears the contents of array. CWT: Config/effects.cwt:2907. */
  "clear_array"(value: string | CwtOpaque): void;
  /** Clear a global event target. CWT: Config/effects.cwt:1364. */
  "clear_global_event_target"(value: string): void;
  /** Clear all global event targets. CWT: Config/effects.cwt:1368. */
  "clear_global_event_targets"(value: true): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3016. */
  "clear_temp_array"(value: string): void;
  /** Clears the contents of a temporary array. CWT: Config/effects.cwt:3019. */
  "clear_temp_array"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:206. */
  "clear_variable"(value: number): void;
  /** Clears a variable. The input is NOT validated CWT: Config/variable_effects.cwt:210. */
  "clear_variable"(value: CwtOpaque): void;
  /** Clear global flag. CWT: Config/effects.cwt:170. */
  "clr_global_flag"(value: string): void;
  /** Creates a dynamic country and runs child effects on it. CWT: Config/effects_new.cwt:327. */
  "create_dynamic_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Creates an enitity Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. For comparison, default minimum zoom level (closest to the map) is 50 units, while default maximum CWT: Config/effects_nsb.cwt:823. */
  "create_entity"(value: { "entity": string; "id"?: string; "var"?: string; "x"?: number; "y"?: number; "z"?: number; "province"?: number; "state"?: StateRef; "rotation": number; "scale": number; "min_zoom": number; "visible"?: string } | CwtNode): void;
  /** Creates a purchase contract between the countries CWT: Config/effects_aat.cwt:253. */
  "create_purchase_contract"(value: { "seller": CountryRef; "buyer": CountryRef; "civilian_factories": number; "equipment": { "type": string; "amount": number } | CwtNode } | CwtNode): void;
  /** Create railway gun effect CWT: Config/effects_nsb.cwt:713. */
  "create_railway_gun"(value: { "equipment": string; "name"?: string; "location"?: number } | CwtNode): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:14. */
  "custom_effect_tooltip"(value: string): void;
  /** Shows just a custom tooltip. CWT: Config/effects.cwt:17. */
  "custom_effect_tooltip"(value: CwtNode): void;
  /** Executes the provided effects but with a custom tooltip surpressing all tooltips from all other effects inside this block. The custom tooltip is a [bindable localization] CWT: Config/effects_gtd.cwt:318. */
  "custom_override_tooltip"(value: CwtNode): void;
  /** Destroys an existing entity IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:849. */
  "destroy_entity"(value: string): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:155. */
  "divide_temp_variable"(value: CwtNode): void;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:179. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:91. */
  "divide_variable"(value: CwtNode): void;
  /** Divides a variable to a value or another variable. CWT: Config/variable_effects.cwt:116. */
  "divide_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): void;
  /** Shows just tooltip of effects. CWT: Config/effects.cwt:1510. */
  "effect_tooltip"(value: CwtNode): void;
  /** Use after (else_)if for a catch-all case. CWT: Config/effects.cwt:431. */
  "else"(value: CwtNode): void;
  /** Use after (else_)if to check other triggers only if first if fails. CWT: Config/effects.cwt:422. */
  "else_if"(value: CwtNode): void;
  /** Shows event option tooltip CWT: Config/effects.cwt:27. */
  "event_option_tooltip"(value: string): void;
  /** - Example *every_collection_element = { limit = { xxx } add_political_power = 1 } - Some collections, like 'country:faction_members', require country scope - Supports 'limit' trigger Applies arbitrary effects to all elements of a collection. Supports both anonymous and regular collections CWT: Config/effects_ncns.cwt:248. */
  "every_collection_element"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfills the "limit" trigger. CWT: Config/effects.cwt:205. */
  "every_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a all countries with original tag. tooltip=key can be defined to override tooltip title. CWT: Config/effects_new.cwt:445. */
  "every_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every country that fulfils the "limit" trigger. Difference with every_country is that it includes countries not yet present on the map. tooltip=key can be defined to override tooltip title. CWT: Config/effects_nsb.cwt:599. */
  "every_possible_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on every state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1067. */
  "every_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/effects.cwt:3261. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/effects.cwt:3247. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): void;
  /** Runs a loop on for each element of an array. CWT: Config/effects.cwt:3042. */
  "for_each_loop"(value: CwtNode): void;
  /** Runs a loop on for each element of an array and changes scope to current element in each iteration. CWT: Config/effects.cwt:3068. */
  "for_each_scope_loop"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Runs a same effects through a loop. example will run the effects for value_name = -3, 0, 3, 6, 9 and then terminate. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. Consider using for_each_loop instead. CWT: Config/effects.cwt:3175. */
  "for_loop_effect"(value: CwtNode): void;
  /** Executes children effects on army leaders for every country in the world that fulfills the "limit" trigger. Better to use every_army_leader if you know the country. CWT: Config/effects.cwt:2355. */
  "global_every_army_leader"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Goes to stated province. CWT: Config/effects.cwt:1690. */
  "goto_province"(value: number): void;
  /** Goes to stated state. CWT: Config/effects.cwt:1694. */
  "goto_state"(value: StateRef): void;
  /** Effect not shown in tooltips. CWT: Config/effects.cwt:3783. */
  "hidden_effect"(value: CwtNode): void;
  /** A conditional effect. CWT: Config/effects.cwt:413. */
  "if"(value: CwtNode): void;
  /** Print message to game.log - Can be localized. CWT: Config/effects.cwt:493. */
  "log"(value: string): void;
  /** Meta effects can be used for building effects from strings and running them. following example will give Germany 42 pp. CWT: Config/effects.cwt:3214. */
  "meta_effect"(value: CwtNode): void;
  /** Modify global flag. Only modifies if flag already exists. CWT: Config/effects.cwt:2071. */
  "modify_global_flag"(value: { "flag": string; "value"?: number; "days"?: number } | CwtNode): void;
  /** Modulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:213. */
  "modulo_temp_variable"(value: CwtNode): void;
  /** Mdulos a temp variable with another. CWT: Config/variable_effects_temp.cwt:219. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:155. */
  "modulo_variable"(value: CwtNode): void;
  /** Modulos a variable with another. CWT: Config/variable_effects.cwt:161. */
  "modulo_variable"(value: { "var": CwtOpaque; "value": number } | CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:144. */
  "multiply_temp_variable"(value: CwtNode): void;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:151. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:83. */
  "multiply_variable"(value: CwtNode): void;
  /** Multiplies a variable to a value or another variable. CWT: Config/variable_effects.cwt:87. */
  "multiply_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /**  CWT: Config/scopes.cwt:44. */
  "NOT"(value: CwtNode): void;
  /**  CWT: Config/scopes.cwt:52. */
  "OR"(value: CwtNode): void;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/effects.cwt:2572. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): void;
  /** Promote the officer of the division to a general scope = unit CWT: Config/effects_gtd.cwt:298. */
  "promote_officer_to_general"(value: boolean): void;
  /** A possible random effect that can occur. CWT: Config/effects.cwt:343. */
  "random"(value: CwtNode): void;
  /** Executes children effects on random country that fulfills the "limit" trigger. CWT: Config/effects.cwt:211. */
  "random_country"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** Executes children effects on a random country with original tag. CWT: Config/effects_new.cwt:420. */
  "random_country_with_original_tag"(value: Effect<ScopeByName["country"]> | { limit?: Trigger<ScopeByName["country"]>; effects: Effect<ScopeByName["country"]> } | CwtNode): void;
  /** A list of possible random effects to trigger in this effect. CWT: Config/effects.cwt:355. */
  "random_list"(value: CwtNode): void;
  /** Runs the effect for a random element in array. CWT: Config/effects.cwt:3082. */
  "random_scope_in_array"(value: Effect<ScopeByName["any"]> | { limit?: Trigger<ScopeByName["any"]>; effects: Effect<ScopeByName["any"]> } | CwtNode): void;
  /** Executes children effects on random state that fulfills the "limit" trigger. CWT: Config/effects.cwt:1049. */
  "random_state"(value: Effect<ScopeByName["state"]> | { limit?: Trigger<ScopeByName["state"]>; effects: Effect<ScopeByName["state"]> } | CwtNode): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:194. */
  "randomize_temp_variable"(value: string): void;
  /** Randomize a temporary variable. CWT: Config/variable_effects_temp.cwt:198. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:132. */
  "randomize_variable"(value: string): void;
  /** Randomize a variable. CWT: Config/variable_effects.cwt:136. */
  "randomize_variable"(value: { "var": string; "distribution": "uniform" | "binomial" | "poisson"; "min"?: number | string; "max"?: number | string; "lambda"?: number } | CwtNode): void;
  /** Randomize weather effect. CWT: Config/effects.cwt:570. */
  "randomize_weather"(value: number): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2869. */
  "remove_from_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2884. */
  "remove_from_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from an array using value or index. CWT: Config/effects.cwt:2894. */
  "remove_from_array"(value: CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2978. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef | string } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:2993. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): void;
  /** Removes an element from a temporary array using value or index. CWT: Config/effects.cwt:3003. */
  "remove_from_temp_array"(value: CwtNode): void;
  /** Removes either a resistance or compliance modifier to a state. Can only use modifiers from the resistance_modifiers.txt/compliance_modifiers.txt that are marked as is_dynamic = yes CWT: Config/effects_ncns.cwt:164. */
  "remove_state_resistance_compliance_modifier"(value: { "modifier": string; "state": StateRef } | CwtNode): void;
  /**  CWT: Config/effects_nsb.cwt:123. */
  "remove_unit_leader_role"(value: string): void;
  /** Reset name of a province back to localization one. CWT: Config/effects.cwt:2120. */
  "reset_province_name"(value: number): void;
  /** Resizes array. CWT: Config/effects.cwt:2911. */
  "resize_array"(value: { "array": string; "value"?: number | string; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes array. CWT: Config/effects.cwt:2928. */
  "resize_array"(value: CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3023. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): void;
  /** Resizes a temp array. CWT: Config/effects.cwt:3035. */
  "resize_temp_array"(value: CwtNode): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:397. */
  "retire_character"(value: string): void;
  /** removes character from all roles and availability CWT: Config/effects_nsb.cwt:409. */
  "retire_character"(value: CwtOpaque): void;
  /** Rounds a temporary variable. CWT: Config/variable_effects_temp.cwt:252. */
  "round_temp_variable"(value: string): void;
  /** Rounds a variable. CWT: Config/variable_effects.cwt:202. */
  "round_variable"(value: CwtOpaque): void;
  /** Save an event target. CWT: Config/effects.cwt:1356. */
  "save_event_target_as"(value: string): void;
  /** Save a global event target. CWT: Config/effects.cwt:1360. */
  "save_global_event_target_as"(value: string): void;
  /**  CWT: Config/scopes.cwt:32. */
  "scope_field"(value: CwtNode): void;
  /** Sets the animation of a specified entity IDs are set by the create_entity effect. Animations are defined within the /Hearts of Iron IV/gfx/models/** /*.asset files. CWT: Config/effects_nsb.cwt:903. */
  "set_entity_animation"(value: { "id": string; "animation": string } | CwtNode): void;
  /** Sets the position and rotation of an entity using two coordinates. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. A positive change in rotation results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:855. */
  "set_entity_movement"(value: { "id": string; "start": { "x": number; "y": number; "z"?: number } | CwtNode; "target": { "province": number } | CwtNode; "ratio": number; "rotation": number } | CwtNode): void;
  /** Sets the position of an existing entity. IDs are set by the create_entity effect. Uses the the same coordinate system that the map uses. CWT: Config/effects_nsb.cwt:873. */
  "set_entity_position"(value: { "id": string; "x": number; "y": number; "z"?: number; "province": "enum"; "state": StateRef } | CwtNode): void;
  /** Sets the currently-facing angle of an existing entity. IDs are set by the create_entity effect. A positive change results in counter-clockwise rotation, a full 360 degrees rotation is approximately 6.28 radians. CWT: Config/effects_nsb.cwt:887. */
  "set_entity_rotation"(value: { "id": string; "rotation": number } | CwtNode): void;
  /** Sets the size of an existing entity. IDs are set by the create_entity effect. CWT: Config/effects_nsb.cwt:895. */
  "set_entity_scale"(value: { "id": string; "scale": number } | CwtNode): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:269. */
  "set_faction_military_unlocked"(value: boolean): void;
  /** Sets wheter the current countries faction can make changes to the faction research section CWT: Config/effects_ncns.cwt:265. */
  "set_faction_research_unlocked"(value: boolean): void;
  /** Set global flag. CWT: Config/effects.cwt:157. */
  "set_global_flag"(value: string): void;
  /** Set global flag. CWT: Config/effects.cwt:160. */
  "set_global_flag"(value: { "flag": string; "value": number; "days"?: number } | CwtNode): void;
  /** Set_province_name = { id = <province id> name = <string> } - Set name for a province. CWT: Config/effects.cwt:2109. */
  "set_province_name"(value: { "id": number; "name": string } | CwtNode): void;
  /** # TEMP VARIABLE Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:53. */
  "set_temp_variable"(value: CwtNode): void;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_effects_temp.cwt:88. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:226. */
  "set_temp_variable_to_random"(value: string): void;
  /** Sets a temp variable to a random value. CWT: Config/variable_effects_temp.cwt:230. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:3. */
  "set_variable"(value: CwtNode): void;
  /** Sets a variable to a value or another variable. CWT: Config/variable_effects.cwt:37. */
  "set_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:168. */
  "set_variable_to_random"(value: string): void;
  /** Sets a variable to a random value. CWT: Config/variable_effects.cwt:172. */
  "set_variable_to_random"(value: { "var": string; "min"?: number | string; "max"?: number | string; "integer"?: boolean } | CwtNode): void;
  /** Sets victory point to province. CWT: Config/effects_new.cwt:964. */
  "set_victory_points"(value: { "province": number; "value": number } | CwtNode): void;
  /** Plays sound effect. CWT: Config/effects.cwt:562. */
  "sound_effect"(value: string): void;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_effects_temp.cwt:133. */
  "subtract_from_temp_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_effects_temp.cwt:140. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:75. */
  "subtract_from_variable"(value: CwtNode): void;
  /** Subtracts a value or a variable to another one. Can define numerical variable with value = 0 CWT: Config/variable_effects.cwt:79. */
  "subtract_from_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): void;
  /**  CWT: Config/effects.cwt:1381. */
  "unlock_national_focus"(value: string): void;
  /** Runs the effect as long as a trigger is true. Warning: will stop after reaching MAX_EFFECT_ITERATION define iterations - default 1000. CWT: Config/effects.cwt:3200. */
  "while_loop_effect"(value: CwtNode): void;
}
export interface GeneratedAnyTriggers {
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1781. */
  "add_to_temp_array"(value: { "array": string; "value"?: number | CountryRef | StateRef | CountryRef; "index"?: "int_variable_field_32" } | CwtNode): boolean;
  /** Adds an element to a temporary array. CWT: Config/triggers.cwt:1800. */
  "add_to_temp_array"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:71. */
  "add_to_temp_variable"(value: CwtNode): boolean;
  /** Adds a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:78. */
  "add_to_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { all_collection_elements = { ``` Example (anonymous collection): Example: *all_collection_elements = { coll CWT: Config/triggers_ncns.cwt:151. */
  "all_collection_elements"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all countries meets the trigger. CWT: Config/triggers.cwt:223. */
  "all_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if all of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:507. */
  "all_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if all country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:195. */
  "all_country_with_original_tag"(value: CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1887. */
  "all_of"(value: CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any false returns false. Otherwise returns true. CWT: Config/triggers.cwt:1918. */
  "all_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if all states meets the trigger. CWT: Config/triggers.cwt:525. */
  "all_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Always returns specified value. CWT: Config/triggers.cwt:146. */
  "always"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:41. */
  "AND"(value: CwtNode): boolean;
  /** ``` } num_of_available_civilian_factories > 5 } name = collection_has_more_than_10_factories operators = { limit = { num_of_civilian_factories > 10 } } input = game:all_countries collection = { any_collection_element = { ``` Example (anonymous collection): Example: *any_collection_element = { collec CWT: Config/triggers_ncns.cwt:124. */
  "any_collection_element"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any country meets the trigger. CWT: Config/triggers.cwt:89. */
  "any_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:533. */
  "any_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any country with current scope's original tag meets the trigger. CWT: Config/triggers_new.cwt:182. */
  "any_country_with_original_tag"(value: CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:552. */
  "any_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each value, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1871. */
  "any_of"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Runs a loop on an array and check a trigger for each scope in it, if any true returns true. Otherwise returns false. CWT: Config/triggers.cwt:1908. */
  "any_of_scopes"(value: Trigger<ScopeByName["any"]> | CwtNode): boolean;
  /** Check if any other country meets the trigger. Excludes current country. CWT: Config/triggers.cwt:1095. */
  "any_other_country"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any of the provided countries (except for the current country) fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:571. */
  "any_other_country_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Checks if any country that has an original tag that matches any of the provided countries and isn't the current country fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:590. */
  "any_other_country_with_original_tag_of"(value: Trigger<ScopeByName["country"]> | CwtNode): boolean;
  /** Check if any state meets the trigger. CWT: Config/triggers.cwt:505. */
  "any_state"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** check if any state in the given category meets the trigger. CWT: Config/triggers_gtd.cwt:84. */
  "any_state_in"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Checks if any of the provided states fulfill the specified triggers. The `target` supports script constants and `tooltip` supports bindable localization. CWT: Config/triggers_ncns.cwt:482. */
  "any_state_of"(value: Trigger<ScopeByName["state"]> | CwtNode): boolean;
  /** Evaluates a math expression and returns true when the result is non-zero. CWT: Config/triggers_taog.cwt:57. */
  "check_expr"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:93. */
  "check_variable"(value: CwtNode): boolean;
  /** Compares a variable to a number or variable. CWT: Config/triggers.cwt:105. */
  "check_variable"(value: { "var": string | number | boolean | CountryRef | StateRef; "value": string | number | boolean | CountryRef | StateRef; "compare"?: string; "tooltip"?: string } | CwtNode): boolean;
  /** Clamps a temp variable between two a values or another variables. CWT: Config/variable_triggers_temp.cwt:190. */
  "clamp_temp_variable"(value: { "var": string; "min"?: number; "max"?: number } | CwtNode): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1844. */
  "clear_temp_array"(value: string | CwtOpaque): boolean;
  /** Clears the contents of a temporary array. CWT: Config/triggers.cwt:1847. */
  "clear_temp_array"(value: number): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:167. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "country": CountryRef } | CwtNode): boolean;
  /** - *collection_contains = { collection = game:all_countries country = FRA }* - *collection_contains = { collection = game:all_countries countries = { ENG GER } }* Possible types to check for are **Countries**: Checks if the provided collection contains all the provided elements. Supports both anonymo CWT: Config/triggers_ncns.cwt:186. */
  "collection_contains"(value: { "collection": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "countries": readonly (CountryRef)[] } | CwtNode): boolean;
  /** - Example: *collection_size = { input = collection:my_awesome_collection value > 1 }* - Variables can be used - Multiple comparisons are allowed: value > x value < y - Supported operators: <, >, = (THIS IS NOT TRUE AS OF 1.17.0.7) - Comparison is inclusive, so "value > X" actually means "value >= X" CWT: Config/triggers_ncns.cwt:396. */
  "collection_size"(value: { "input": string | { "input": string; "name"?: string; "operators"?: CwtNode } | CwtNode; "value": number } | CwtNode): boolean;
  /** Returns true if the specified number of sub-triggers return true. CWT: Config/triggers.cwt:1278. */
  "count_triggers"(value: CwtNode): boolean;
  /** Check if the specified country exist. CWT: Config/triggers.cwt:354. */
  "country_exists"(value: CountryRef): boolean;
  /**  CWT: Config/triggers_gtd.cwt:153. */
  "custom_override_tooltip"(value: CwtNode): boolean;
  /** Works as an and-trigger with a custom tooltip. CWT: Config/triggers.cwt:760. */
  "custom_trigger_tooltip"(value: CwtNode): boolean;
  /** Checks for a specific date. CWT: Config/triggers.cwt:619. */
  "date"(value: string): boolean;
  /** Evaluates a math expression and writes the numeric result to the tooltip. CWT: Config/triggers_taog.cwt:31. */
  "debug_math_expr"(value: CwtNode): boolean;
  /** Check if the difficulty is above or below specified value 0-2 (difficulty enum). Example: difficulty > 0 (above easy). CWT: Config/triggers.cwt:46. */
  "difficulty"(value: number): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:104. */
  "divide_temp_variable"(value: CwtNode): boolean;
  /** Divides a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:128. */
  "divide_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string; "if_zero"?: number } | CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:28. */
  "else"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:21. */
  "else_if"(value: CwtNode): boolean;
  /** check cost of equipment production line CWT: Config/triggers_gtd.cwt:108. */
  "equipment_cost"(value: CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the highest value and stores result in temp variables. CWT: Config/triggers.cwt:2006. */
  "find_highest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Runs a loop on for each element of an array, finds the lowest value and stores result in temp variables. CWT: Config/triggers.cwt:1992. */
  "find_lowest_in_array"(value: { "array": string | CwtOpaque; "value"?: string; "index"?: string } | CwtNode): boolean;
  /** Returns true if all of the active game rule options allow achievements. CWT: Config/triggers.cwt:1758. */
  "game_rules_allow_achievements"(value: true): boolean;
  /** Returns true if the game has any custom difficulty on. CWT: Config/triggers.cwt:1124. */
  "has_any_custom_difficulty_setting"(value: boolean): boolean;
  /** Returns true if the game has the specified custom difficulty on. CWT: Config/triggers.cwt:1120. */
  "has_custom_difficulty_setting"(value: string): boolean;
  /** Checks if player has a DLC. Example: has_dlc = "name of the dlc". CWT: Config/triggers.cwt:176. */
  "has_dlc"(value: string): boolean;
  /** Checks if current scope or global scope has the specified event target saved. CWT: Config/triggers.cwt:1570. */
  "has_event_target"(value: string): boolean;
  /** Checks if a game rule is set to a particular option. CWT: Config/triggers.cwt:1751. */
  "has_game_rule"(value: { "rule": string; "option": string } | CwtNode): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:155. */
  "has_global_flag"(value: string): boolean;
  /** Has global flag been set. Check flag val date set and days since set. Example: has_global_flag = test_flag. CWT: Config/triggers.cwt:160. */
  "has_global_flag"(value: { "flag": string; "value"?: number; "date"?: string; "days"?: number } | CwtNode): boolean;
  /** Checks if a state contains a railway at or above the specified level. CWT: Config/triggers_nsb.cwt:29. */
  "has_railway_level"(value: { "level": number; "state": StateRef } | CwtNode): boolean;
  /** Compare the initial start date of current game. CWT: Config/triggers.cwt:615. */
  "has_start_date"(value: string): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1550. */
  "has_variable"(value: string): boolean;
  /** Checks if a variable exists in a scope. CWT: Config/triggers.cwt:1554. */
  "has_variable"(value: number): boolean;
  /** Trigger not shown in tooltips. CWT: Config/triggers.cwt:2114. */
  "hidden_trigger"(value: CwtNode): boolean;
  /** A conditional trigger. CWT: Config/triggers.cwt:14. */
  "if"(value: CwtNode): boolean;
  /** Checks if a the combatant or leader has a border war. CWT: Config/triggers.cwt:1586. */
  "is_border_war"(value: boolean): boolean;
  /** Returns true if game is in debug mode (launched with -debug argument). CWT: Config/triggers_new.cwt:86. */
  "is_debug"(value: boolean): boolean;
  /** Checks if scope leader is from an exiled government. is_exiled_leader = yes. CWT: Config/triggers.cwt:1681. */
  "is_exiled_leader"(value: true): boolean;
  /** Checks if scope leader is from specified exiled government. is_exiled_leader_from = FRA. CWT: Config/triggers.cwt:1700. */
  "is_exiled_leader_from"(value: CountryRef): boolean;
  /** Check if the historical focus is active. CWT: Config/triggers.cwt:992. */
  "is_historical_focus_on"(value: boolean): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1762. */
  "is_in_array"(value: { "array": string | CwtOpaque; "value": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1769. */
  "is_in_array"(value: CwtNode): boolean;
  /** Checks if an element is in array. CWT: Config/triggers.cwt:1775. */
  "is_in_array"(value: { "variable_field_32": string | number | boolean | CountryRef | StateRef } | CwtNode): boolean;
  /** Check if current game is ironman. CWT: Config/triggers.cwt:611. */
  "is_ironman"(value: boolean): boolean;
  /** Check if the tutorial is active. CWT: Config/triggers.cwt:988. */
  "is_tutorial"(value: boolean): boolean;
  /** All inside trigger must be true. At least one entry inside trigger must be true. Negates content of trigger. Print message to game.log - Can be localized. CWT: Config/triggers_new.cwt:15. */
  "log"(value: string): boolean;
  /** Meta triggers can be used for building triggers from strings and running them. following example will test if Germany has 42 pp. CWT: Config/triggers.cwt:1951. */
  "meta_trigger"(value: CwtNode): boolean;
  /** Modulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:161. */
  "modulo_temp_variable"(value: CwtNode): boolean;
  /** Mdulos a temp variable with another. CWT: Config/variable_triggers_temp.cwt:167. */
  "modulo_temp_variable"(value: { "var": string; "value": number } | CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:93. */
  "multiply_temp_variable"(value: CwtNode): boolean;
  /** Multiplies a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:100. */
  "multiply_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /**  CWT: Config/scopes.cwt:34. */
  "NOT"(value: CwtNode): boolean;
  /**  CWT: Config/scopes.cwt:42. */
  "OR"(value: CwtNode): boolean;
  /** Compares the amount of turns that have passed during the peace conference with a number. CWT: Config/triggers_bba.cwt:175. */
  "pc_turn"(value: number): boolean;
  /** Prints all variables in scope and temp variables to a file. CWT: Config/triggers.cwt:1635. */
  "print_variables"(value: { "file": string | number | boolean | CountryRef | StateRef; "text"?: string | number | boolean | CountryRef | StateRef; "append"?: boolean; "print_global"?: boolean; "var_list"?: readonly (string)[] } | CwtNode): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:143. */
  "randomize_temp_variable"(value: string): boolean;
  /** Randomize a temporary variable. CWT: Config/variable_triggers_temp.cwt:147. */
  "randomize_temp_variable"(value: { "var": string; "distribution": "uniform" | "binomial"; "min"?: number; "max"?: number; "lambda"?: number } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1811. */
  "remove_from_temp_array"(value: { "array": string; "value": number | CountryRef | StateRef | CountryRef } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1824. */
  "remove_from_temp_array"(value: { "array": string; "index": "int_variable_field_32" } | CwtNode): boolean;
  /** Removes an element from a temporary array using value or index. CWT: Config/triggers.cwt:1833. */
  "remove_from_temp_array"(value: CwtNode): boolean;
  /** Check amount of reserves. CWT: Config/triggers.cwt:76. */
  "reserves"(value: number): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1851. */
  "resize_temp_array"(value: { "array": string; "value"?: number; "size": "int_variable_field_32" } | CwtNode): boolean;
  /** Resizes a temp array. CWT: Config/triggers.cwt:1863. */
  "resize_temp_array"(value: CwtNode): boolean;
  /** Rounds a temporary variable. CWT: Config/variable_triggers_temp.cwt:200. */
  "round_temp_variable"(value: string): boolean;
  /** Check if the current scope exist. CWT: Config/triggers_gtd.cwt:104. */
  "scope_exists"(value: boolean): boolean;
  /**  CWT: Config/scopes.cwt:1. */
  "scope_field"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:3. */
  "set_temp_variable"(value: CwtNode): boolean;
  /** Sets a temp variable to a value or another variable. CWT: Config/variable_triggers_temp.cwt:38. */
  "set_temp_variable"(value: { "var": string; "value": number | CountryRef | StateRef | string | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:174. */
  "set_temp_variable_to_random"(value: string): boolean;
  /** Sets a temp variable to a random value. CWT: Config/variable_triggers_temp.cwt:178. */
  "set_temp_variable_to_random"(value: { "var": string; "min"?: number; "max"?: number; "integer"?: boolean } | CwtNode): boolean;
  /** Subtracts a value or a variable to a temp variable. Can define numerical variable with value = 0 CWT: Config/variable_triggers_temp.cwt:82. */
  "subtract_from_temp_variable"(value: CwtNode): boolean;
  /** Subtracts a value or a variable to a temp variable. CWT: Config/variable_triggers_temp.cwt:89. */
  "subtract_from_temp_variable"(value: { "var": string; "value": number | CwtNode | string | number | boolean | CountryRef | StateRef; "tooltip"?: string } | CwtNode): boolean;
  /** Check the global threat value. 0-1 value. CWT: Config/triggers.cwt:142. */
  "threat"(value: number): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:706. */
  "tooltip_evaluation"(value: "eval"): boolean;
  /** ``` } } add_to_temp_variable = { unlock_compare = num_armies } } operators = { faction_members } input = game:scope collection = { all_collection_elements = { set_temp_variable = { unlock_compare = 0 } tooltip_evaluation = eval hidden_trigger = { ``` ```hidden_trigger = { tooltip_evaluation = no_eva CWT: Config/triggers_ncns.cwt:733. */
  "tooltip_evaluation"(value: "no_eval"): boolean;
}
export interface GeneratedEffectsByScope {
  "country": GeneratedCountryEffects;
  "state": GeneratedStateEffects;
  "character": GeneratedCharacterEffects;
  "unit_leader": GeneratedUnitLeaderEffects;
  "operative": GeneratedOperativeEffects;
  "project": GeneratedProjectEffects;
  "combat": GeneratedCombatEffects;
  "military_industrial_organization": GeneratedMilitaryIndustrialOrganizationEffects;
  "purchase_contract": GeneratedPurchaseContractEffects;
  "unit": GeneratedUnitEffects;
  "raid": GeneratedRaidEffects;
  "operation": GeneratedOperationEffects;
  "any": GeneratedAnyEffects;
}
export interface GeneratedTriggersByScope {
  "country": GeneratedCountryTriggers;
  "state": GeneratedStateTriggers;
  "character": GeneratedCharacterTriggers;
  "unit_leader": GeneratedUnitLeaderTriggers;
  "operative": GeneratedOperativeTriggers;
  "project": GeneratedProjectTriggers;
  "combat": GeneratedCombatTriggers;
  "military_industrial_organization": GeneratedMilitaryIndustrialOrganizationTriggers;
  "purchase_contract": GeneratedPurchaseContractTriggers;
  "unit": GeneratedUnitTriggers;
  "raid": GeneratedRaidTriggers;
  "operation": GeneratedOperationTriggers;
  "any": GeneratedAnyTriggers;
}
