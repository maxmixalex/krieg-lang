// Editorial task groupings. TypeDoc continues to own signatures, fields and links.
export const topics = {
  "hoi4/series": {
    title: "从有限表生成连续编号内容",
    names:
      "DefinitionSeries FlagAchievements FlagAchievementSpec AchievementStorageBank indexBy gameScripts",
    guide: "ports/index.md",
    intro:
      "DefinitionSeries(first, count, make) 在构建时给每行一个编号，make 仍返回普通的有类型定义。适合数百张图标、产业组织修正或登记表。FlagAchievements 把具名的连续 flag 暴露为同一成就组；游戏存档已使用的编号不能随意重排。两者都检查数量上限。",
    example:
      'import { DefinitionSeries, DynamicModifier, FlagAchievements } from "krieg-lang/hoi4";\nFlagAchievements("naval_service", {prefix:"naval_medal_",count:12});\nDefinitionSeries(1,3,slot=>DynamicModifier({id:"office_"+slot,entries:{political_power_gain:"office_cost_"+slot}}));',
  },
  "hoi4/actions": {
    title: "付费行动：共享资格、执行与界面绑定",
    names: "CountryAction CountryActionSpec CountryActionDefinition",
    guide: "guide/actions.md",
    intro:
      "`CountryAction(id, spec)` 将一项国家行动的资格条件、政治点数成本与执行效果写在一起。`politicalPowerCost` 是非负安全整数，`available` 是可选资格条件，`perform` 描述成功执行后的效果。返回句柄的 `.available` 可传给 `country.test`，`.execute` 可传给 `country.run`；两者都是普通的国家作用域 scripted handle。\n\n`.available` 同时检查资格与余额；`.execute` 在执行时再次检查，扣除一次费用，再调用 `perform`。这保证按钮显示后状态发生变化时也按当前条件执行。ScriptedWindow 的国家上下文按钮可直接写 `action={handle}`，此时不再同时填写 `click` / `enabled`。\n\n决议使用 `action: handle` 绑定同一行动，费用由游戏原生决议机制扣除，资格与执行体分别复用。行动决议不再同时填写 `cost` / `available` / `completeEffect`，仍可设置可见性、持续时间等其他决议字段。下方将构造器、输入和句柄放在同一页，普通决议字段可从[决议参考](decisions.md)继续查看。",
    example:
      'import { CountryAction, CountryEvent, Decision, DecisionCategory } from "krieg-lang/hoi4";\n\nconst aid = CountryAction("recovery_aid", {\n  politicalPowerCost: 25,\n  available: country => !country.triggers.hasCountryFlag("aid_received"),\n  perform: country => {\n    country.effects.addStability(0.05);\n    country.effects.setCountryFlag("aid_received");\n  },\n});\n\nDecisionCategory({ id: "reconstruction_office", decisions: [\n  Decision({ id: "fund_relief", action: aid }),\n] });\n\nCountryEvent({ id: "relief.1", hidden: true, isTriggeredOnly: true,\n  immediate: country => country.run(aid.execute),\n});',
  },
  "hoi4/events": {
    title: "事件、选项与调度句柄",
    names:
      "CountryEvent NewsEvent StateEvent EventSpec EventOption Option EventDefinition EventDelay EventIdentifier EventId",
    guide: "guide/events.md",
    intro:
      "事件构造器声明游戏内容并返回带作用域的事件句柄。把句柄保存在普通常量中，就能在另一个效果回调内调用 `country.schedule(handle, delay)`；不会在编译时触发游戏事件。`EventSpec` 描述整场事件，`EventOption` / `Option` 描述玩家选择，二者与返回句柄在本页连续列出。\n\n`trigger` 决定事件条件，`immediate` 是触发时立即执行的效果，`options` 是可选回答；`isTriggeredOnly` 适合由国策、决议或其他事件明确安排的事件。`title`、`description` 和选项 `name` 应填写本地化键，文本内容放在本地化文件中。",
    example:
      'import { CountryEvent, Option } from "krieg-lang/hoi4";\n\nexport const aid = CountryEvent({\n  id: "reconstruction.1",\n  title: "RECONSTRUCTION_TITLE",\n  description: "RECONSTRUCTION_DESC",\n  isTriggeredOnly: true,\n  options: [Option({\n    name: "ACCEPT_AID",\n    effects: country => country.effects.addPoliticalPower(25),\n  })],\n});\n// 在国家效果回调中：country.schedule(aid, { days: 2 });',
  },
  "hoi4/focus-graphs": {
    title: "国策图、前置关系与返回句柄",
    names:
      "FocusGraph FocusGraphSpec FocusGraphDefinition FocusGraphNodeSpec FocusNodeSpec FocusNodes FocusNodeSet FocusNodeKey FocusSelector FocusRequirement FocusSequence FocusJoin FocusReference",
    guide: "guide/focuses.md",
    intro:
      "用 `FocusGraph` 声明一个由命名节点组成的完整国策图。`nodes` 的键是编译期引用，输出 ID 由树的 `prefix` 与节点键组合而成；改变节点排列不会改变 ID。返回对象的 `focuses` 可传给国家作用域的完成国策检查和效果。\n\n把解锁条件写在节点自己的 `requires` 中：`f => f.charter` 要求一个前置，`{ all: [...] }` 要求全部完成，`{ any: [...] }` 接受任意一个；可以嵌套组合。`exclusiveWith` 选择互斥节点，编译器自动建立对称关系。`FocusNodes` 定义可复用节点模块，展开后仍保留精确名称和上下文类型。\n\n图会检查不存在的节点、环、空分组和无法满足的互斥前置。布局缺省值根据图的依赖深度生成；需要对齐已有原生树或共享国策时，可使用 [FocusTree](focus-trees.md) 提供精确位置和原生前置分组。",
    example:
      'import { FocusGraph } from "krieg-lang/hoi4";\n\nexport const recovery = FocusGraph({\n  id: "recovery", prefix: "REC",\n  nodes: {\n    charter: { cost: 3 },\n    industry: { requires: f => f.charter, cost: 5, completionReward: c => c.effects.addPoliticalPower(50) },\n    relief: { requires: f => f.charter, cost: 5 },\n  },\n});',
  },
  "hoi4/focus-trees": {
    title: "精确编排国策树",
    names: "FocusTree FocusTreeSpec Focus FocusSpec FocusId",
    guide: "guide/actions.md",
    intro:
      "`Focus` 返回可放入树中的国策配置；`FocusTree` 才声明输出的树。适合已有原生树、手动坐标、共享国策和需要原生前置分组的内容。`completionReward` 接收国家作用域效果，`available` 与 `bypass` 接收条件；`x`、`y` 是游戏国策网格坐标，`cost` 保留原生国策的计量方式。\n\n若主要工作是分支、合流与互斥关系，可从 [FocusGraph](focus-graphs.md) 开始。下方同时列出构造函数与完整字段，便于从一次调用直接查看配置。",
    example:
      'import { Focus, FocusTree } from "krieg-lang/hoi4";\n\nFocusTree({\n  id: "reconstruction",\n  focuses: [Focus({\n    id: "REC_charter", icon: "GFX_goal_generic_political_pressure",\n    x: 0, y: 0, cost: 5,\n    completionReward: c => c.effects.addPoliticalPower(50),\n  })],\n});',
  },
  "hoi4/decisions": {
    title: "决议类别、决议与条件",
    names:
      "DecisionCategory DecisionCategorySpec Decision DecisionSpec DecisionBaseSpec DecisionMissionSpec",
    guide: "guide/focuses.md",
    intro:
      "先用 `Decision` 描述单项决议，再放入 `DecisionCategory.decisions`。类别控制一组决议的可见性和解锁条件；决议自己的条件控制这一项是否出现、能否点击。`completeEffect` 是玩家执行决议时的效果，`cost` 是政治点数成本。\n\n`mission: { days, activation, cancel, timeout }` 描述定时任务，保留游戏的任务条与取消语义。`days` 必须是正整数；任务与 `CountryAction` 互斥。类别支持 `scriptedGui` 绑定 TSX 窗口，类别和决议均支持 `priority`。所有条件与效果回调在游戏的国家作用域中解释。",
    example:
      'import { Decision, DecisionCategory } from "krieg-lang/hoi4";\n\nDecisionCategory({\n  id: "recovery_programme",\n  decisions: [Decision({\n    id: "fund_reconstruction", cost: 25,\n    completeEffect: country => country.effects.addStability(0.05),\n  })],\n});',
  },
  "hoi4/ideas": {
    title: "民族精神与修正",
    names: "Idea IdeaSpec IdeaModifiers IdeaId",
    guide: "guide/ideas.md",
    intro:
      "`Idea` 声明可由国家效果添加或移除的民族精神。`modifier` 是持续修正，`allowedCivilWar` 控制内战新国家保留该精神的资格，`onAdd` / `onRemove` 是进入和离开时执行的效果；二者不要互相替代。修正值使用游戏原生单位，例如比例型数值通常写小数。声明后通过稳定的 `id` 与 `country.effects.addIdeas(id)` 连接玩法。完整原生分类可查 `IdeaCategory` / `NativeIdeas`。",
  },
  "hoi4/scripted-effects": {
    title: "可复用效果与有限变体",
    names:
      "ScriptedEffect StateScriptedEffect ScriptedEffectDefinition ScriptedEffectFamily ScriptedEffectFamilyDefinition ScriptedVariants ScriptedVariantValue",
    guide: "guide/scripted-content.md",
    intro:
      "`ScriptedEffect` 把效果体写入游戏可复用的 scripted effect 文件，返回的句柄通过 `scope.run(handle)` 调用。句柄记录声明作用域，国家效果不能误用在地区作用域。`StateScriptedEffect` 是地区作用域的便捷入口。\n\n需要按若干配置生成同类内容时，`ScriptedEffectFamily` 遍历有限参数表，生成普通原生效果和按键访问的句柄。参数在编译期展开；游戏运行时的变量应在效果回调中使用作用域 API。",
  },
  "hoi4/scripted-triggers": {
    title: "可复用条件与有限变体",
    names:
      "ScriptedTrigger StateScriptedTrigger ScriptedTriggerDefinition ScriptedTriggerFamily ScriptedTriggerFamilyDefinition",
    guide: "guide/scripted-content.md",
    intro:
      "`ScriptedTrigger` 把布尔条件定义成游戏可复用的 scripted trigger。用 `scope.test(handle)` 引用返回句柄，用 `!scope.test(handle)` 否定它；函数体内的条件在相应游戏作用域执行。`ScriptedTriggerFamily` 将有限配置表展开为多份具名条件，适合为不同档位、地区或政策复用一份结构。",
  },
  "hoi4/localisation": {
    title: "本地化键与动态文本",
    names:
      "loc LocalisationKey ScriptedLocalisation ScriptedLocalisationDefinition ScriptedLocalisationSpec ScriptedLocalisationText",
    guide: "guide/localisation.md",
    intro:
      "普通显示文本通过本地化键引用，翻译内容由项目的 YAML / 原生本地化流程生成。`loc` 保持键的意图清晰；`ScriptedLocalisation` 则按游戏条件选择文本片段，适合名称、提示或描述随状态变化的场景。动态文本声明返回具名定义，可由原生本地化表达式引用。",
  },
  "hoi4/meta-effects": {
    title: "原生 MetaEffect 参数替换",
    names: "MetaEffect MetaEffectSpec MetaParameterNames MetaParameterValue",
    guide: "guide/scripted-content.md",
    intro:
      "`MetaEffect` 面向确实需要原生文本替换的效果结构。参数名由模板推导并静态检查，输出仍使用游戏的 meta effect 机制。普通代码复用应优先使用源码辅助函数或 ScriptedEffect；有限已知变体可用 ScriptedEffectFamily，便于获得逐项命名的句柄。",
  },
  "hoi4/countries": {
    title: "国家引用与历史",
    names: "country Country CountryRef CountryHistory CountryHistorySpec",
    guide: "guide/countries-maps.md",
    intro:
      "`country(tag)` 创建国家引用；它描述编译目标，不能当作 JavaScript 游戏对象读取。使用 `scope.country(reference, callback)` 切换作用域。`CountryHistory` 生成国家历史，适合初始政治、科技、国策等设置；国家标签与颜色等定义可从原生内容领域的 `CountryDefinition` 查找。",
  },
  "hoi4/states": {
    title: "地区引用与历史",
    names:
      "state State StateRef StateHistory StateHistorySpec StateBuildings ProvinceBuildings StateResources",
    guide: "guide/countries-maps.md",
    intro:
      "`state(id)` 创建地区引用；省份 ID 与地区 ID 是不同层次。`StateHistory` 描述地区的初始归属、资源和建筑，`StateBuildings` 与 `ProvinceBuildings` 分别对应地区级、具体省份级设置。修改地图相关内容前，通过项目世界和地图验证核对实际 ID。",
  },
  "hoi4/scope-selection": {
    title: "作用域切换与通用回调",
    names:
      "ScopeBase Scope ScopeByName ScopeName Effect Trigger Definition IdentifiedDefinition FlagId VariableName AssetId",
    guide: "guide/scopes.md",
    intro:
      "`Effect<S>` 表示在游戏作用域 S 执行效果，`Trigger<S>` 表示在该作用域计算条件。回调由编译器解释为原生脚本；不能执行网络、文件或任意 JavaScript。`ScopeBase` 提供国家与地区选择、遍历以及 scripted handle 调用。进入新的回调后，类型和原生作用域都会随之切换。",
  },
  "hoi4/country-scope": {
    title: "国家作用域：条件与效果",
    names: "CountryScope CountryEffects CountryTriggers",
    guide: "guide/scopes.md",
    intro:
      "国家回调参数提供政治点数、国策检查、事件调度等语义 API；`hasEquipment(type, amount, comparison)` 明确区分 `atLeast` 与严格 `moreThan` 库存门槛，人口、指挥点与各类工厂可直接用数值属性比较；`.effects` 执行效果，`.triggers` 构造条件。下方保留手工建模的便利方法，继承的原生命令连接到带签名和来源的[效果与条件目录](../../commands/index.md)，避免在多个作用域重复整张命令表。原生命令目录同时标明合法作用域。",
  },
  "hoi4/state-scope": {
    title: "地区作用域：条件与效果",
    names: "StateScope StateEffects StateTriggers",
    guide: "guide/scopes.md",
    intro:
      "地区回调用于建筑、人口、旗标与所有权等地区内容。`buildingLevel(type)` 返回当前建筑等级，可直接写 `> 0` 等比较。切换到所有者国家后再操作国家资源。`.effects` 与 `.triggers` 的原生命令须遵守当前作用域，完整签名见[命令目录](../../commands/index.md)；下方将地区接口与常用便利方法放在一起。",
  },
  "hoi4/defines": {
    title: "Lua Defines 与覆盖对象",
    names: "Defines DefineFile DefineOverrides",
    guide: "guide/domains/index.md",
    intro:
      "`Defines` 声明 Lua 全局游戏参数的覆盖值；`DefineFile` 允许指定生成文件路径。`DefineOverrides` 的每个字段都是可选项，只写需要覆盖的命名空间和键。完整键表按 [Lua 根与命名空间](../../defines/namespaces.md) 分页，避免下载一张包含数千项的参考页。",
    example:
      'import { Defines } from "krieg-lang/hoi4";\n\nDefines("recovery", { NDefines: { NGame: { START_DATE: "1936.1.1.12" } } });',
  },
  "hoi4/ordered-data": {
    title: "有序数据与原生补充结构",
    names: "cwt CwtNode CwtValue CwtOpaque DataFile DataValue DataRecord SourceFile",
    guide: "guide/domains/index.md",
    intro:
      "`DataFile` 面向普通结构化内容；重复键、比较运算符和顺序敏感的内容可使用 PDX 节点。`cwt` 把这些节点包装成规则接受的原生补充结构。`CwtOpaque` 表明类型系统无法安全表达一项规则，不能把它当作随意填值的许可；核对原生定义和对应 CWT 来源。",
  },
  "ui/windows": {
    title: "ScriptedWindow：布局与游戏行为",
    names:
      "ScriptedWindow ScriptedWindowSpec ScriptedWindowParent GuiBindings GuiElementBindings GuiButtonBindings GuiMouseEvents GuiIconBindings GuiListBinding GuiListBindings GuiPositionBindings GuiFrameBindings GuiTextureBindings GuiVariable",
    guide: "guide/ui.md",
    intro:
      "`ScriptedWindow` 同时生成一份 `.gui` 静态布局和一份 scripted GUI 行为。回调收到的 `ui.Button`、`ui.Icon` 等组件把可见性、点击和动态属性绑定到唯一的元素名。`context` 决定回调作用域；布局必须有一个根 Container，元素名不能冲突。\n\n`Button.events` 的 `rightClick`、`shiftClick`、`controlClick` 和 `altClick` 分别生成原生修饰点击事件；这些回调沿用窗口作用域。`GuiVariable` 支持 `array^index` 引用，仅读取已有游戏变量，不会创建或初始化变量，也不会自动更新 dirty。需要读取游戏动态数组或绑定外部已有窗口时，请查 [ScriptedGui](scripted-gui.md)。静态外观与复用类见[样式和 Stack](styles.md)。",
    example:
      'import { ScriptedWindow } from "krieg-lang/ui";\n\nScriptedWindow(\n  { name: "investment", path: "interface/investment.gui", context: "player_context" },\n  ui => <ui.Container name="investment_window">\n    <ui.Button name="invest" text="INVEST"\n      enabled={country => country.politicalPower >= 25}\n      click={country => country.effects.addPoliticalPower(-25)} />\n  </ui.Container>,\n);',
    language: "tsx",
  },
  "ui/scripted-gui": {
    title: "已有窗口、动态列表与 ScriptedGui",
    names:
      "ScriptedGui ScriptedGuiSpec ScriptedGuiContext ScriptedGuiScope ScriptedGuiProperties GuiDynamicList ScopedGuiDynamicList GuiAiWeight GuiAiTestScope GuiWeight GuiClickName GuiTriggerName GuiParentWindowToken WeightModifier",
    guide: "guide/ui.md",
    intro:
      "`ScriptedGui` 为已有窗口声明行为，窗口名和元素名必须与 `.gui` 内容一致。它适合原生界面资源、游戏动态列表和需要精确原生属性的场景。`dynamicLists` 使用游戏运行时数组；这与在编译时展开固定数组的 `For` 不同。类型参数由 `context` 推导，使按钮效果、条件和 AI 权重使用正确作用域。",
  },
  "ui/layout": {
    title: "容器、重复内容与基础几何",
    names:
      "Container ContainerProps For GuiFile GuiElement GuiChild ElementProps GuiPosition GuiSize GuiCoordinate GuiOrientation GuiOrigin",
    guide: "guide/ui.md",
    intro:
      "`Container` 组织子元素，`GuiFile` 将静态元素写入指定界面文件。`position` 与 `size` 使用游戏界面坐标；百分比和 `@` 常量等取值按原生 GUI 规则输出。`orientation` 决定定位参照，`origo` 决定元素自身的原点。\n\n`For` 在编译期按数组顺序展开子元素，适合固定按钮组或状态格。它不会产生游戏运行时循环；需要根据实时游戏数组增删元素时使用 ScriptedGui 的动态列表。",
  },
  "ui/buttons-text": {
    title: "按钮、图标与文本",
    names: "Button ButtonProps Icon IconProps Text TextProps",
    guide: "guide/ui.md",
    intro:
      "独立的 `Button`、`Icon`、`Text` 声明静态 GUI 元素；ScriptedWindow 提供的同名上下文组件再额外接受行为绑定。`spriteType` 引用 GFX sprite 名称，`text` 引用显示文本或本地化键；`frame` 选择多帧图像中的帧。文本的 `maxWidth`、`maxHeight`、`multiline` 和对齐设置决定原生文本布局。\n\n复用公共属性时从 `ElementProps` 开始；按钮的 `click` / `enabled` 属于 `GuiButtonBindings`，位于 [ScriptedWindow 页面](windows.md)，便于区分静态外观与游戏状态。",
  },
  "ui/lists": {
    title: "网格、列表与滚动",
    names:
      "GridBox GridBoxProps ListBox ListBoxProps OverlappingElementsBox OverlappingElementsBoxProps SmoothListBox SmoothListBoxProps Scrollbar ScrollbarProps ExtendedScrollbar ExtendedScrollbarProps",
    guide: "guide/ui.md",
    intro:
      "网格和列表控件提供游戏原生的槽位、间距与滚动设置。`GridBox.slotsize` 决定每个槽位的尺寸，最大行列数限制排布；`ListBox` 描述列表本身的外观。控件声明不会自动生成数据来源，静态重复内容使用 `For`，实时列表由 ScriptedGui.dynamicLists 驱动。",
  },
  "ui/styles": {
    title: "样式类与 Stack 布局",
    names: "GuiClass GuiStyleProps Stack StackProps GuiStyleClass GuiStyleModule GuiStyleValue",
    guide: "guide/styles.md",
    intro:
      "把重复的静态 GUI 外观写进 `.krg.css` 并在 TSX 中引用，可让多个窗口共享间距、尺寸和字体等设置。样式在编译时转换为原生 GUI 属性，可复制的 CSS 与 TSX 双文件示例见[样式模块入门](../../../guide/styles.md#style-module)。`Stack` 用于组织有明确间距的静态子元素，涉及游戏状态的 visible、enabled 与 click 仍通过 ScriptedWindow 的绑定提供。\n\n下例生成两个纵向按钮，原生位置分别为 `(16, 48)` 与 `(16, 88)`。第二个按钮在第一个按钮的 32 高度之后再留出 8 的间距。子控件必须提供数值尺寸，详细限制见 [Stack 布局边界](../../../guide/styles.md#static-stack)。",
    example:
      'import { GuiFile, Container, Button, Stack } from "krieg-lang/ui";\n\nGuiFile("interface/recovery_actions.gui",\n  <Container name="recovery_actions" size={{ width: 280, height: 160 }}>\n    <Stack position={{ x: 16, y: 48 }} gap={8}>\n      <Button name="industry" text="REC_INDUSTRY" size={{ width: 240, height: 32 }} />\n      <Button name="relief" text="REC_RELIEF" size={{ width: 240, height: 32 }} />\n    </Stack>\n  </Container>,\n);',
    language: "tsx",
  },
  "ui/sprites": {
    title: "Sprite 与纹理资源",
    names: "Sprite SpriteSpec SpriteFile AnimatedSprite AnimatedSpriteSpec",
    guide: "guide/assets.md",
    intro:
      "`Sprite` 描述一个 GFX sprite，`SpriteFile` 把 sprite 声明写入 `.gfx` 文件。`textureFile` 是模组输出中的纹理路径，资源复制由项目 assets 配置完成。TSX 控件通过 `spriteType` 使用 sprite 的名称；多帧图像的帧数须与实际纹理布局一致。",
  },
  "ui/native-controls": {
    title: "原生 GUI 控件与完整属性",
    names:
      "Window WindowProps NativeContainer NativeContainerProps NativeButton NativeButtonProps NativeIcon NativeIconProps NativeText NativeTextProps NativeGridBox NativeGridBoxProps NativeListBox NativeListBoxProps GuiButton GuiButtonProps TextBox TextBoxProps Position PositionProps Browser BrowserProps Checkbox CheckboxProps DropDownBox DropDownBoxProps EditBox EditBoxProps",
    guide: "guide/ui.md",
    intro:
      "这些构造器保留原生 GUI 控件的字段结构，适合迁移已有界面或需要高层组件未暴露的设置。每个构造器与对应 Props 在相邻章节，字段类型来自固定 CWT 规则。原生字段保留游戏命名，和高层组件的 camelCase 属性可能不同；不要混用两套字段。",
  },
  "ui/jsx": {
    title: "JSX 类型与原生标签",
    names: "JSX NativeIntrinsicElements ElementChildrenAttribute Element IntrinsicElements",
    guide: "guide/ui.md",
    intro:
      '这些类型为 TypeScript 的 JSX 检查提供元素、children 和原生标签定义。项目通过 `jsxImportSource: "krieg-lang/ui"` 使用自动 JSX 类型入口；写作时通常直接导入组件即可。组件函数与原生小写标签都由编译器静态识别。',
  },
  "project/build": {
    title: "构建、打包与诊断结果",
    names:
      "buildProject packProject descriptor BuildResult ProjectBuildOptions ProjectDiagnostic OutputFile ModMetadata",
    guide: "guide/projects.md",
    intro:
      "`buildProject` 读取项目配置、依赖和游戏根，编译并验证最终模组。检查 `success` 后再使用产物；失败时诊断包含位置与代码，并保留上一次成功输出。`check: true` 用于只验证，`writeEditor` 同步编辑器声明。`packProject` 先构建再生成可搬移 ZIP，成功时返回 `archive`。\n\n`BuildResult.files` 是产物清单与校验摘要，`OutputFile` 则是内存中的字节数据。只编译一段源码、不需要资源和世界验证时使用[编译器入口](../compiler/compile.md)。",
    example:
      'import { buildProject, packProject } from "krieg-lang/project";\n\nconst checked = buildProject("./my-mod", { check: true });\nif (!checked.success) console.error(checked.diagnostics);\nelse {\n  const packed = packProject("./my-mod");\n  if (packed.archive) console.log(packed.archive);\n}',
  },
  "project/configuration": {
    title: "项目配置、依赖与编辑器",
    names:
      "loadConfig KriegConfig GameRoot ProjectOptions AssetRule LocalisationRule resolveDependencies DependencyGraph ProjectLayer initProject writeEditorProject",
    guide: "guide/projects.md",
    intro:
      "`loadConfig` 将配置和调用选项解析为完整 `KriegConfig`；`ProjectOptions.gameRoots` 按原版到模组的顺序叠加数据。资源的 `from` / `to` 描述复制路径，`override` 明确允许覆盖依赖的同路径产物。`LocalisationRule` 指定语言、格式和输入文件。\n\n`resolveDependencies` 给出解析后的项目层，`writeEditorProject` 用同一组根和依赖更新 `.krieg` 声明。`initProject` 用于建立新项目骨架，通常可以直接使用对应 CLI 命令。",
  },
  "project/world": {
    title: "有效游戏世界与文件覆盖",
    names: "createWorld applyReplacePaths ProjectWorld WorldFile",
    guide: "guide/projects.md",
    intro:
      "`createWorld` 将游戏根与项目层合成为有效文件视图，供地图、国家和本地化验证共享。`effectiveFiles` 使用游戏内相对路径作为键；`WorldFile` 可引用磁盘来源，也可携带内存字节。\n\n`applyReplacePaths` 会修改传入 Map，只清除所列目录的直接子文件，不递归清空所有后代。用于定制构建工具时，先保留自己需要的基线副本，再按真实加载顺序应用覆盖。",
  },
  "project/atlas": {
    title: "地图索引、已检查引用与 ProvinceAtlas",
    names:
      "ProvinceAtlas ProvinceAtlasError ProvinceAtlasOptions AtlasProvince AtlasArea LandProvinceRef GeographyIndex indexGeography geographyDeclaration",
    guide: "guide/map-atlas.md",
    intro:
      "`indexGeography` 从有效世界文件读取省份、地区和战略区域；`ProvinceAtlas` 在这些真实数据上提供查询与路径规划。使用 checked land references 可以在规划前发现海省、缺失省份或错误地区。`ProvinceAtlasError` 是地图输入或查询无法成立时的异常类型，应携带上下文反馈给作者。\n\n地图文件的读取集合由 `WorldFile` 表示，见[有效游戏世界](world.md)。铁路计划与覆盖文件在[铁路页面](railways.md)，与地图数据结构分开以保持页面可读。",
  },
  "project/railways": {
    title: "铁路计划、线路与覆盖文件",
    names:
      "createRailwayOverlay parseRailwayPlan RailwayPlan RailwayRouteSpec RailwayRouteRequest RailwayLevel PlannedRailwayRoute RailwayOverlayResult",
    guide: "guide/map-atlas.md",
    intro:
      "`parseRailwayPlan` 校验外部输入并给出带类型的计划；`createRailwayOverlay` 在 ProvinceAtlas 上规划路线，合并成铁路输出。路线使用实际相邻陆地省份，等级由 `RailwayLevel` 限定。`via` 等路径约束属于线路请求，输出计划记录最终经过的省份。\n\n在项目工作流中，把计划或接收 atlas 的回调传给 ProjectOptions.railways，可确保使用最终有效世界。不要把地区 ID 当作省份线路节点。",
  },
  "project/import": {
    title: "导入原生项目与转换结果",
    names: "importProject ImportProjectResult",
    guide: "guide/native-import.md",
    intro:
      "`importProject` 把已有模组或单个原生脚本导入一个新的 Krieg 项目目录。目标必须为空且不能位于输入目录中；单文件导入要提供输出的游戏路径。转换采用事务式写入，遇到损坏脚本时保留目标现状。结果分别统计转换与复制文件，并返回诊断，便于批量导入工具准确报告边界。",
    example:
      'import { importProject } from "krieg-lang/project";\n\nconst result = importProject("./legacy/events/recovery.txt", "./converted", {\n  outputPath: "events/recovery.txt",\n});\nif (!result.success) console.error(result.diagnostics);',
  },
  "project/validation": {
    title: "国家、地图与本地化验证",
    names: "validateCountries validateMap validateLocalisation parseNativeLocalisation",
    guide: "guide/validation.md",
    intro:
      "这些函数适合将 Krieg 验证整合进自己的 Node.js 工作流。验证基于有效文件世界，检查内容之间的引用关系；`parseNativeLocalisation` 解析游戏原生本地化。正常项目构建已调用相关检查，单独调用时要先准备与构建一致的输入和加载顺序。诊断是静态证据，游戏中的最终显示和行为仍通过实际游戏验证。",
  },
  "project/debugging": {
    title: "从原生文件定位源码",
    names: "traceOutput traceGameLog TracedLocation TracedLogEntry",
    guide: "guide/debugging.md",
    intro:
      "当游戏日志给出生成文件和原生行号时，使用输出来源信息定位产生该内容的 `.krg.ts` / `.krg.tsx`。查询应针对同一次构建的产物与映射；改变源码后重新构建，才能让原生位置与源位置保持对应。返回值与位置字段如下，完整排错流程见指南。",
  },
  "compiler/compile": {
    title: "编译源码、读取诊断与序列化输出",
    names:
      "compileProject compileSource CompileOptions CompileResult CompileOutput PdxCompileOutput LuaCompileOutput KriegDiagnostic emitCompileOutput CompileOutputBase",
    guide: "guide/language.md",
    intro:
      "`compileSource` 适合编辑器、测试和单段源码；`compileProject` 接收文件列表与编译选项。两者做类型检查和静态降低，不执行用户源码。失败时读取 `diagnostics`，成功后遍历 `outputs`。\n\n输出是带 `format` 判别字段的联合：PDX 使用 `document`，Lua 使用 `text`。统一调用 `emitCompileOutput` 获取原生文本，不要假设所有输出都是 PDX。编译接口不会替代项目层的资源复制、依赖打包和世界验证。",
    example:
      'import { compileSource, emitCompileOutput } from "krieg-lang/compiler";\n\nconst result = compileSource(`\n  import { CountryEvent } from "krieg-lang/hoi4";\n  CountryEvent({ id: "example.1", hidden: true, isTriggeredOnly: true });\n`);\nif (!result.success) console.error(result.diagnostics);\nelse for (const output of result.outputs) {\n  console.log(output.path, emitCompileOutput(output));\n}',
  },
  "compiler/schema": {
    title: "CWT 模式与编辑器声明",
    names:
      "CwtSchema CwtCommandRule CwtFieldRule CwtValueRule generateCommandDeclarations MINIMAL_LIB",
    guide: "guide/validation.md",
    intro:
      "自定义编译宿主可通过 `CompileOptions.schema` 提供固定 CWT 模式，或用 `generateCommandDeclarations` 为编辑器生成对应命令声明。规则携带来源、作用域和字段约束；它们描述已知原生结构，不能代替引擎运行语义。`MINIMAL_LIB` 是静态语言所需的最小 TypeScript 库声明，通常交由编译器内部使用。",
  },
  "pdx/construct": {
    title: "构造有序 PDX 文档",
    names:
      "atom quoted string block property entry tagged document file PdxAtom PdxBlock PdxProperty PdxTagged PdxDocument PdxFile PdxItem PdxValue PdxOperator operators SourceSpan",
    guide: "guide/native-import.md",
    intro:
      "PDX 节点按数组保留顺序与重复键。`property` / `entry` 表示有操作符的键值项，`block` 表示有序内容；不要用普通 JavaScript 对象代替重复项。`string` / `quoted` 用于带引号文本，`atom` 用于需原样保留的原生 token。发出文本前应确认 token 往返解析不会改变语义。",
  },
  "pdx/parse": {
    title: "词法、解析与原生诊断",
    names: "lexPdx parsePdx ParsePdxOptions PdxLexResult PdxParseResult PdxDiagnostic PdxToken",
    guide: "guide/native-import.md",
    intro:
      "`parsePdx` 把原生文本转为有序文档并返回诊断，适合导入、验证和定制迁移工具；`lexPdx` 只执行词法分析。先检查诊断的 severity，再使用解析结果。`sourceName` 用于给错误定位加上来源文件名，保留源码的选项适合需要展示上下文的工具。",
  },
  "pdx/emit": {
    title: "输出 PDX 与语义比较",
    names: "emitPdx EmitPdxOptions semanticPdx comparePdxSemantic",
    guide: "guide/native-import.md",
    intro:
      "`emitPdx` 序列化有序文档；格式选项控制文本布局，节点顺序与重复键仍保留。`comparePdxSemantic` 用于检验解析、修改和重新输出后内容的结构语义是否一致，不能证明脚本在游戏中具有相同行为。`semanticPdx` 适合需要稳定结构表示的比较工具。",
  },
  "eslint/configuration": {
    title: "ESLint 配置与规则",
    names: "configs default rules",
    guide: "guide/editor.md",
    intro:
      "把 `configs.recommended` 加入 ESLint flat config，即可在编辑器中发现不支持的语法、导入和显式 any 等问题。规则是快速静态反馈，编译器仍负责完整的类型与语义检查。`rules` 暴露单独规则，供维护者定制配置。",
    example:
      'import { configs } from "krieg-lang/eslint";\n\nexport default [configs.recommended];',
  },
};

topics["hoi4/runtime-state"] = {
  title: "持久变量、动态作用域与运行时集合",
  names: "RuntimeScopePath StateTargetRef countryTarget stateTarget",
  guide: "guide/scopes.md",
  intro:
    "`scope.variable(name)` 读取已有游戏变量，`setVariable`、`addVariable`、`multiplyVariable` 等方法更新具名值，临时变量使用相应 Temp 方法。ROOT 与 global 引用跨嵌套作用域保持绝对名称。`countryTarget` 和 `stateTarget` 明确选择 ROOT、FROM.FROM 或保存的作用域；国家与州引用不能混用。`everyGlobalState` 遍历世界全部州，`everyState` 遍历当前国家拥有的州。`forRange` 的 end 不包含在循环中，`whileLoop` 与 forRange 保持当前作用域，并受游戏 MAX_EFFECT_ITERATION 上限约束。",
};
topics["hoi4/audio-banks"] = {
  title: "可交互音效库",
  names: "AudioBank AudioBankSpec AudioBankDefinition",
  guide: "guide/ui.md",
  intro:
    "`AudioBank(category, {path, clips})` 为每个 clip 同时生成音频资源、soundeffect 和分类成员。`bank.sounds` 保留精确键名补全，可直接交给按钮的 clickSound。路径相对于 sound 目录；音频二进制仍由项目 assets 提供。可集中设置音量、预载入与压缩器；`maxAudible` 将同时可听实例限制为正整数，达到上限时忽略新播放。非法路径、音量和并发上限会阻止编译。",
};
topics["hoi4/country-heatmaps"] = {
  title: "按国家数值绘制地图",
  names: "CountryHeatmap CountryHeatmapSpec MapColor",
  guide: "guide/map-atlas.md",
  intro:
    "`CountryHeatmap` 根据一个具名国家数值建立分段颜色地图。bands 按相对最大值的比例递减，颜色为零到一的 RGB 三元组。编译器生成最大值选择、阈值取整、FROM 着色及地图加载定义；无序阈值、非法颜色或零除数会产生诊断。maximumDivisor 用于压缩最大值标尺，roundThresholds 与 highlightMaximum 控制原生计算细节。",
};

topics["hoi4/mio-scope-targets"] = {
  title: "军工组织作用域引用",
  names: "MioScopeRef mioTarget",
  guide: "guide/scopes.md",
  intro:
    "`mioTarget` 建立独立于国家和地区的军工组织作用域引用。可在组织迭代内保存 THIS/PREV 引用，再由 scope.militaryOrganization(mioTarget('var:saved_mio'), callback) 进入该组织。变量必须由真实组织作用域写入；此 API 不创建组织，也不把国家或地区引用转换成组织。非法目标语法与错误引用类型会阻止编译。",
};

export const topicForName = new Map();
for (const [key, value] of Object.entries(topics))
  for (const name of value.names.split(" ")) topicForName.set(name, key);

export const nativeGroups = [
  ["events", "原生事件", /^(Native.*Event|MeanTimeToHappen)/],
  [
    "focuses",
    "原生国策与共享国策",
    /^(NativeFocusTree|SharedFocus|JointFocus|FocusStyle|ContinuousFocusPalette)/,
  ],
  ["decisions", "原生决议", /^NativeDecision/],
  [
    "politics",
    "政治、理念与国家规则",
    /^(NativeIdeas|IdeaCategory|Ideology|Autonomy|BalanceOfPower|Country|GameRule|OpinionModifier)/,
  ],
  [
    "characters",
    "人物、领袖与特质",
    /^(Character|CountryLeaderTrait|UnitLeaderTrait|ScientistTrait|Portrait|Ace|Ability|UnitMedal)/,
  ],
  ["technology", "科技与学说", /^(Technology|Doctrine|GrandDoctrine|Subdoctrine)/],
  ["equipment", "装备与模块", /^(Equipment|CriticalPart|PrototypeReward)/],
  ["industry", "工业、建筑与科研项目", /^(MilitaryIndustrial|Mio|Building|Resource|Special)/],
  ["units", "部队、历史与战斗", /^(Unit|Division|Ship|Combat|Raid)/],
  ["intelligence", "情报与行动", /^(Intelligence|Operation|Resistance|Occupation)/],
  ["factions", "阵营与外交", /^(Faction|Wargoal|Peace)/],
  [
    "map",
    "地图、地区与环境",
    /^(Terrain|Strategic|Supply|StateCategory|Adjacency|Spawn|ScriptedMapMode|GraphicalTerrain)/,
  ],
  [
    "graphics",
    "图形、模型与动画",
    /^(Entity|Mesh|Light|Particle|PdxParticle|ModelAnimation|GraphicDatabase)/,
  ],
  ["audio", "音频、音乐与字体", /^(Sound|Music|BitmapFont)/],
  ["ai", "AI 定义", /^Ai/],
  ["rules", "规则、修正与其他定义", /.*/],
];
