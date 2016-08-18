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

		$data = self::getTemplateMessages();
		$data[ 'accessibility-statement-url'] = self::getStatementUrl();
		if( in_array( $wgAccessibilityToolbarPosition, array( "top", "bottom" ) ) ) {
			$data[ 'button-position' ] = $wgAccessibilityToolbarPosition;
		}

		//echo '<pre dir="ltr">';
		//print_r( $data );
		//echo '</pre>';

		$templateParser = new \TemplateParser(  __DIR__ . '/templates' );
		$toolbarWidget = $templateParser->processTemplate(
			'Toolbar',
			$data
		);

		$text .= $toolbarWidget;

		return true;

	}

	
	private function getTemplateMessages() {
		return array(
			'msg-a11ytoolbar-btn-tooltip' => wfMessage( 'a11ytoolbar-btn-tooltip' )->text(),
			'msg-a11ytoolbar-header' => wfMessage( 'a11ytoolbar-header' )->text(),
			'msg-a11ytoolbar-close-btn' => wfMessage( 'a11ytoolbar-close-btn' )->text(),
			'msg-a11ytoolbar-increase-font' => wfMessage( 'a11ytoolbar-increase-font' )->text(),
			'msg-a11ytoolbar-decrease-font' => wfMessage( 'a11ytoolbar-decrease-font' )->text(),
			'msg-a11ytoolbar-filter-high-contrast' => wfMessage( 'a11ytoolbar-filter-high-contrast' )->text(),
			'msg-a11ytoolbar-filter-grayscale' => wfMessage( 'a11ytoolbar-filter-grayscale' )->text(),
			'msg-a11ytoolbar-filter-invert' => wfMessage( 'a11ytoolbar-filter-invert' )->text(),
			'msg-a11ytoolbar-highlight-links' => wfMessage( 'a11ytoolbar-highlight-links' )->text(),
			'msg-a11ytoolbar-reset-settings' => wfMessage( 'a11ytoolbar-reset-settings' )->text(),
			'msg-a11ytoolbar-statement' => wfMessage( 'a11ytoolbar-statement' )->text()
       );

	}

	private function getStatementUrl() {
		$statementPageMsg = wfMessage( 'a11ytoolbar-statement-page' );
		if ( $statementPageMsg->isDisabled() ) {
			return null;
		}
		$title = Title::newFromText( $statementPageMsg->text() );

		return ( $title === null ? null : $title->getLocalURL() );
	}

}

