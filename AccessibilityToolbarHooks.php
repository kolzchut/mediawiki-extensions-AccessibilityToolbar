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
	 * @param OutputPage &$out
	 * @param Skin &$skin current skin
	 *
	 * @return bool
	 */
	public static function onBeforePageDisplay( OutputPage &$out, Skin &$skin ) {
		$out->addModules( 'ext.accessibilityToolbar' );

		return true;
	}

	/**
	 * @param Skin $skin
	 * @param string &$text
	 *
	 * @return bool
	 * @throws MWException
	 */
	public static function onSkinAfterBottomScripts( \Skin $skin, &$text ) {
		global $wgAccessibilityToolbarPosition;
		if ( $wgAccessibilityToolbarPosition !== 'none' ) {
			$toolbar = new AccessibilityToolbar();
			$text .= $toolbar->getHtml();
		}
		return true;
	}
}
