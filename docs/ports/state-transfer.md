# State Transfer Tool：区分操作者和被选中的州

在转移工具里，玩家所属国家、选中的州、州的所有者与实际控制者不一定相同。一个错放的作用域可能依然生成合法脚本，却把另一国的州转走。原模组的原生回调通过 `ROOT` 与 `FROM.FROM` 区分这些对象。

[重写项目](https://github.com/maxmixalex/krieg-lang/tree/main/examples/rewrites/state-transfer-tool)在一个地方声明 `root = countryTarget("ROOT")` 和 `selectedState = stateTarget("FROM.FROM")`。前者进入国家回调，后者进入州回调；参数的 scope 不匹配会触发类型错误。筛选全部标记州时使用 `everyGlobalState`，不受玩家“当前拥有的州”限制。可见性和已标记数量的条件也只写一次，多处按钮复用。

例如，修改“有标记州时才显示”的规则，应改共享条件，无需在每个转移按钮的 native triggers 与 effects 中重复改动。四个窗口和九个按钮仍各自有原生名字和快捷键；Scripted GUI 的绑定由相应 TSX 控件产生。

**怎样核对。** 原作和重写的脚本分别在三国六州的模型中执行十个连续操作，检查每一步的所有者、控制者、核心、标记和计数；再按 32 种输入组合对照可见性。工资、时钟等无关机制不在这个模型中。原译文的 116 个键及其值另行一一核对。

[作用域手册](../guide/scopes.md) · [界面绑定](../guide/ui.md) · [复现输入](index.md)
