import { GuiFile, Container, Icon, Button, Text } from "krieg-lang/ui";
export const medalPopup = GuiFile("interface/career_profile/medal_and_ribbon_popup_window.gui", [
  <Container
    name="medal_popup_window"
    position={{ x: 20, y: -260 }}
    showPosition={{ x: -20, y: -260 }}
    size={{ width: 362, height: 150 }}
    orientation="LOWER_RIGHT"
    origo="lower_right"
    showAnimationType="decelerated"
    animationTime={600}
    fadeType="linear"
    fadeTime={400}
    background={{ name: "Background", spriteType: "GFX_tiled_stats_bg" }}
  >
    <Container
      name="content"
      position={{ x: 0, y: 0 }}
      size={{ width: "100%", height: "100%" }}
      fadeType="linear"
      fadeTime={600}
    >
      <Container name="medal" position={{ x: 15, y: 39 }} size={{ width: 80, height: 80 }}>
        {["bg", "mg", "fg1"].map((layer, i) => (
          <Icon
            name={"layer" + i}
            position={{ x: 40, y: 35 }}
            spriteType={"GFX_career_profile_medal_" + layer}
            centerPosition
          />
        ))}
      </Container>
      <Text
        name="title"
        position={{ x: 100, y: 30 }}
        text=""
        font="hoi_18mbs"
        maxWidth={230}
        maxHeight={40}
        fixedSize
      />
      <Text
        name="description"
        position={{ x: 100, y: 60 }}
        text=""
        font="hoi_18"
        maxWidth={240}
        maxHeight={110}
        fixedSize
      />
    </Container>
    <Button
      name="frame"
      position={{ x: 0, y: 0 }}
      spriteType="GFX_widget_frame_medal"
      clickSound="click_scroll"
    />
  </Container>,
  [false, true].map((bank) => (
    <Container
      name={bank ? "custom_achievement_popup_window" : "ribbon_popup_window"}
      position={{ x: bank ? 5000 : 20, y: bank ? 5000 : -260 }}
      showPosition={{ x: bank ? 5000 : -20, y: bank ? 5000 : -260 }}
      size={{ width: bank ? 1 : 300, height: bank ? 1 : 200 }}
      orientation="LOWER_RIGHT"
      origo="lower_right"
      showAnimationType="decelerated"
      animationTime={bank ? 0 : 600}
      fadeType="linear"
      fadeTime={bank ? 0 : 400}
      background={{ name: "Background", spriteType: "GFX_tiled_stats_bg" }}
    >
      <Container
        name="content"
        position={{ x: 0, y: 0 }}
        size={{ width: "100%", height: "100%" }}
        fadeType="linear"
        fadeTime={600}
      >
        <Container
          name="ribbon"
          position={{ x: 0, y: 50 }}
          size={{ width: 176, height: 50 }}
          orientation="CENTER_UP"
          origo="center_up"
        >
          {bank && (
            <Icon
              name="missing"
              position={{ x: 0, y: 0 }}
              spriteType="GFX_career_profile_ribbon_missing"
            />
          )}
          {["bg", "fg1", "fg2", "fg3"].map((layer, i) => (
            <Icon
              name={"layer" + i}
              position={{ x: 0, y: 0 }}
              spriteType={"GFX_career_profile_ribbon_" + layer}
            />
          ))}
        </Container>
        {bank && (
          <Icon
            name="achievement_icon"
            spriteType="GFX_idea_unknown"
            position={{ x: 0, y: 75 }}
            centerPosition
            orientation="CENTER_UP"
          />
        )}
        <Text
          name="title"
          position={{ x: 20, y: 20 }}
          text="title"
          font="hoi_18mbs"
          maxWidth={260}
          format="center"
          multiline={false}
        />
        <Text
          name="description"
          position={{ x: 20, y: bank ? 125 : 110 }}
          text="description"
          font="hoi_18"
          maxWidth={260}
          format="center"
          multiline
        />
      </Container>
      <Button
        name="frame"
        size={{ width: 300, height: 200 }}
        spriteType="GFX_tiled_widget_frame_ribbon"
        clickSound="click_scroll"
      />
    </Container>
  )),
]);
