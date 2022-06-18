---
sidebar_position: 4
---

# FAQ

## What's the difference with @gorhom/bottomsheet package?

While ghorom's package is **definitely more complete**, right now, in my experience, it's quite **a lot bugged** when it comes to basic usages of the component (e.g. rendering an [input inside the bottomsheet](https://github.com/gorhom/react-native-bottom-sheet/issues/902) in android).
Also there are many more issues that get automatically closed after 5 days, the code isn't very friendly in terms of contribution.
When it works, though, it shines especially with complex usages, but I think **it doesn't fit the majority of usages**.<br/>

**This library**, instead, aims to have the **simplest API**, as well as the **simplest implementation**, while solving the hard problem of rendering scrollable content within a draggable bottomsheet. Of course to achieve this, some small ux details are a bit rough, but we can work on that.<br/>

The majority of other libs, instead, **don't support** scrollable contents or **they're not very responsive** in terms of gestures and animations.
