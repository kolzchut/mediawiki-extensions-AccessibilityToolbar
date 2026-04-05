<?php

namespace MediaWiki\Extension\AccessibilityToolbar;

use MediaWiki\Config\Config;
use MediaWiki\Hook\BeforePageDisplayHook;
use MediaWiki\Hook\SkinAfterBottomScriptsHook;
use MediaWiki\Output\OutputPage;
use MediaWiki\Title\TitleFactory;
use Skin;

class Hooks implements BeforePageDisplayHook, SkinAfterBottomScriptsHook {

	public function __construct(
		private readonly Config $config,
		private readonly TitleFactory $titleFactory,
	) {
	}

	/**
	 * BeforePageDisplay hook — adds the modules to the page
	 *
	 * @param OutputPage $out
	 * @param Skin $skin
	 */
	public function onBeforePageDisplay( $out, $skin ): void {
		$out->addModules( 'ext.accessibilityToolbar' );
	}

	/**
	 * @param Skin $skin
	 * @param string &$text
	 * @throws \MWException
	 */
	public function onSkinAfterBottomScripts( $skin, &$text ): void {
		if ( $this->config->get( 'AccessibilityToolbarPosition' ) !== 'none' ) {
			$toolbar = new AccessibilityToolbar( $this->config, $this->titleFactory );
			$text .= $toolbar->getHtml();
		}
	}
}
