AccessibilityToolbar for MediaWiki
==================================

This started out as a port for MediaWiki of [Real Accessability] (by [RealMedia]),
a Wordpress plugin. However, it was heavily modified and well on the way
to eliminate most or all of the original code.

[Real Accessability]: https://wordpress.org/plugins/real-accessability/
[RealMedia]: http://realmedia.co.il


## Please note:
- This extension's style is dependent on the following:
  - Bootstrap 3 (specifically the panel component)
  - FontAwesome 4.6.3
  This are included in skin:Helena, which this was created for, but you can include them yourself.
- As this is a client side tool, it will probably cause a Flash of Unstyled Content (FOUC)
  on page load before applying the user-configured filters.


## Configuration
- `$wgAccessibilityToolbarPosition` = "top" / "bottom"
  Whether the toggle button and toolbar will be absolutely positioned
  at the top-left or bottom-left (or top-right, etc. for RTL languages).



## Other sources of inspiration
- [fluid project][fluid]'s display preferences
- [SOGO Accessibility] by [SOGO]
- Task [T91201] by Wikimedia, accessibility settings design

[fluid]: http://build.fluidproject.org/infusion/demos/prefsFramework/
[SOGO Accessibility]: https://wordpress.org/plugins/sogo-accessibility/
[SOGO]: http://sogo.co.il
[T91201]: https://phabricator.wikimedia.org/T91201
