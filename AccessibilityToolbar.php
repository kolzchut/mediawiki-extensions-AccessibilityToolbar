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
					'$wgAccessibilityToolbarPosition is set to an invalid value ("' .
					$wgAccessibilityToolbarPosition . '"")'
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

	/**
	 * @return string
	 */
	public function getHtml() {
		return $this->html;
	}

	/**
	 * @return array
	 */
	private static function getTemplateMessages() {
		$messageNames = [
			'a11ytoolbar-btn-tooltip',
			'a11ytoolbar-header',
			'a11ytoolbar-close-btn',
			'a11ytoolbar-increase-font',
			'a11ytoolbar-decrease-font',
			'a11ytoolbar-filter-high-contrast',
			'a11ytoolbar-filter-grayscale',
			'a11ytoolbar-filter-invert',
			'a11ytoolbar-highlight-links',
			'a11ytoolbar-reset-settings',
			'a11ytoolbar-statement'
		];
		$messages = [];
		foreach ( $messageNames as $name ) {
			$messages[ 'msg-' . $name ] = wfMessage( $name )->text();
		}

		return $messages;
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
