<?php
class AccessibilityToolbar {
	private $html = '';

	public function __construct() {
		global $wgAccessibilityToolbarPosition, $wgAccessibilityToolbarIconColor;

		$templateParser = new \TemplateParser( __DIR__ . '/templates' );
		$data = self::getTemplateMessages();
		$data[ 'accessibility-statement-url'] = self::getStatementUrl();

		if ( $wgAccessibilityToolbarPosition !== 'none' ) {
			if ( in_array( $wgAccessibilityToolbarPosition, [ 'top', 'bottom' ] ) ) {
				$data[ 'button-position' ] = $wgAccessibilityToolbarPosition;
			} else {
				throw new MWException(
					'$wgAccessibilityToolbarPosition is set to an invalid value ("' . $wgAccessibilityToolbarPosition . '"")'
				);
			}

			if ( $wgAccessibilityToolbarIconColor !== null
			     && self::validateHexColor( $wgAccessibilityToolbarIconColor )
			) {
				$data[ 'icon-color' ] = $wgAccessibilityToolbarIconColor;
			}

			$this->html = $templateParser->processTemplate(
				'Toolbar',
				$data
			);
		} else {
			$this->html = $templateParser->processTemplate(
				'Menu',
				$data
			);
		}
	}

	public function getHtml() {
		return $this->html;
	}


	private static function getTemplateMessages() {
		return [
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
		];

	}

	private static function validateHexColor( $color ) {
		if ( preg_match( '/#([a-f0-9]{3}){1,2}\b/i', $color ) ) {
			// hex color is valid
			return true;
		}

		return false;
	}

	private static function getStatementUrl() {
		$statementPageMsg = wfMessage( 'a11ytoolbar-statement-page' );
		if ( $statementPageMsg->isDisabled() ) {
			return null;
		}
		$title = Title::newFromText( $statementPageMsg->text() );

		return ( $title === null ? null : $title->getLocalURL() );
	}



}
