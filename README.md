AccessibilityToolbar for MediaWiki
==================================

This started out as a port for MediaWiki of [Real Accessability]
(by [RealMedia]), a Wordpress plugin. However, it was heavily modified
and well on the way to eliminate most or all of the original code.

[Real Accessability]: https://wordpress.org/plugins/real-accessability/
[RealMedia]: http://realmedia.co.il

## Capabilities
- Enlarge/reduce font size
- Emphasize links - force underline and bold
- Three types of filters:
  - High Contrast 
  - Grayscale
  - Invert colors

## Dependencies
This extension's style is dependent on FontAwesome 4.6.3, which is included in skin:Helena,
but you can include it yourself when using another skin.

## Compatibility
Tested in Firefox 48, Chrome 52, IE10, IE11, Microsoft Edge.

In IE10 & IE11 filter options will not be available.


## Possible issues
As this is a client-side tool, it will probably cause a FOUC
(Flash of Unstyled Content) on page load before applying the
current user settings.


## Configuration
- `$wgAccessibilityToolbarPosition` = "top" / "bottom" / "none"
    Whether the toggle button and toolbar will be absolutely positioned
    at the top-left or bottom-left (or top-right, etc. for RTL languages).
    Setting this to "none" means that you must render the menu yourself;
    add your own button and make it toggle the menu (which you get by
    calling `AccessibilityToolbar->getHtml()`).
- `$wgAccessibilityToolbarIconColor` = '#fff'
    Allows you to customize the color of the icon. The default is null,
    so the icon will be the defualt link color on your site.
    Set this to any valid color hex code (either 3- or 6-digits),
    including the hash tag.

    Instead of using this, you can also override the color using CSS,
    which allows the override to be per-skin:

        #real-accessability-btn {
            color: #ccc;
        }

## Other sources of inspiration
- [fluid project][fluid]'s display preferences
- [SOGO Accessibility] by [SOGO]
- Task [T91201] by Wikimedia, accessibility settings design

[fluid]: http://build.fluidproject.org/infusion/demos/prefsFramework/
[SOGO Accessibility]: https://wordpress.org/plugins/sogo-accessibility/
[SOGO]: http://sogo.co.il
[T91201]: https://phabricator.wikimedia.org/T91201

## License
- This extension is available under the GPL-2.0+ license.
- The original [Real Accessability] wordpress plugin by [RealMedia] is
  licensed under the [GPL-2.0+], and its source code may be found here:
  https://wordpress.org/plugins/real-accessability/developers/
  
    (please note the the source code included with this MediaWiki
    extension is heavily modified from the original)


[GPL-2.0+]: http://www.gnu.org/licenses/gpl-2.0.html

## Changelog

### 0.3.0
Removed dependency on HelenaResourceLoaderModule and Boostrap 3 -
CSS styles were imported into the extension and CSS variables are used for compatibility.

### 0.2.0
New configuration option: $wgAccessibilityToolbarIconColor. Removed the
default color and background color from the button in favor of this.

### 0.1.0
This is the initial beta, unleashed on the unsuspecting world.
