<?php

namespace MediaWiki\Extension\AccessibilityToolbar;

use MediaWiki\Config\Config;
use MediaWiki\Title\TitleFactory;
use MWException;
use TemplateParser;

class AccessibilityToolbar {

	private string $html = '';

	public function __construct(
		private readonly Config $config,
		private readonly TitleFactory $titleFactory,
	) {
		$position = $this->config->get( 'AccessibilityToolbarPosition' );
		$iconColor = $this->config->get( 'AccessibilityToolbarIconColor' );

		$templateParser = new TemplateParser( __DIR__ . '/../templates' );
		$data = self::getTemplateMessages();
		$data['accessibility-statement-url'] = $this->getStatementUrl();

		if ( $position !== 'none' ) {
			if ( in_array( $position, [ 'top', 'bottom' ] ) ) {
				$data['button-position'] = $position;
			} else {
				throw new MWException(
					'$wgAccessibilityToolbarPosition is set to an invalid value ("' .
					$position . '"")'
				);
			}

			if ( $iconColor !== null && self::validateHexColor( $iconColor ) ) {
				$data['icon-color'] = $iconColor;
			}

			$this->html = $templateParser->processTemplate( 'Toolbar', $data );
		} else {
			$this->html = $templateParser->processTemplate( 'Menu', $data );
		}
	}

	public function getHtml(): string {
		return $this->html;
	}

	private static function getTemplateMessages(): array {
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
			$messages['msg-' . $name] = wfMessage( $name )->text();
		}

		return $messages;
	}

	private static function validateHexColor( string $color ): bool {
		return (bool)preg_match( '/#([a-f0-9]{3}){1,2}\b/i', $color );
	}

	private function getStatementUrl(): ?string {
		$statementPageMsg = wfMessage( 'a11ytoolbar-statement-page' );
		if ( $statementPageMsg->isDisabled() ) {
			return null;
		}
		$title = $this->titleFactory->newFromText( $statementPageMsg->text() );

		return ( $title === null ? null : $title->getLocalURL() );
	}
}
