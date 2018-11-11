<?php
/**
 * AccessibilityToolbar extension hooks
 *
 * @file
 * @ingroup Extensions
 * @license MIT
 */
class AccessibilityToolbarHooks {
	/**
	 * BeforePageDisplay hook
	 * Adds the modules to the page
	 *
	 * @param $out OutputPage output page
	 * @param $skin Skin current skin
	 *
	 * @return bool
	 */
	public static function onBeforePageDisplay( OutputPage &$out, Skin &$skin ) {
		$out->addModules( 'ext.accessibilityToolbar' );

		return true;
	}

	public static function onSkinAfterBottomScripts( \Skin $skin, &$text ) {
		global $wgAccessibilityToolbarPosition;
		if ( $wgAccessibilityToolbarPosition !== 'none' ) {
			$toolbar = new AccessibilityToolbar();
			$text .= $toolbar->getHtml();
		}
		return true;
	}
}

