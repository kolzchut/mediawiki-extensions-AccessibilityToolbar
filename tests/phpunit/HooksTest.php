<?php

namespace MediaWiki\Extension\AccessibilityToolbar\Tests;

use MediaWiki\Config\Config;
use MediaWiki\Extension\AccessibilityToolbar\Hooks;
use MediaWiki\Output\OutputPage;
use MediaWiki\Title\TitleFactory;
use MediaWikiUnitTestCase;
use Skin;

/**
 * @covers \MediaWiki\Extension\AccessibilityToolbar\Hooks
 */
class HooksTest extends MediaWikiUnitTestCase {

	private function makeHooks( array $configValues = [] ): Hooks {
		$config = $this->createMock( Config::class );
		$config->method( 'get' )->willReturnCallback(
			static function ( string $key ) use ( $configValues ) {
				return $configValues[$key] ?? null;
			}
		);
		return new Hooks( $config, $this->createMock( TitleFactory::class ) );
	}

	public function testOnBeforePageDisplayAddsModule(): void {
		$hooks = $this->makeHooks();

		$out = $this->createMock( OutputPage::class );
		$out->expects( $this->once() )
			->method( 'addModules' )
			->with( 'ext.accessibilityToolbar' );

		$hooks->onBeforePageDisplay( $out, $this->createMock( Skin::class ) );
	}

	public function testOnSkinAfterBottomScriptsSkipsWhenPositionNone(): void {
		$hooks = $this->makeHooks( [ 'AccessibilityToolbarPosition' => 'none' ] );

		$text = '';
		$hooks->onSkinAfterBottomScripts( $this->createMock( Skin::class ), $text );

		$this->assertSame( '', $text, 'No HTML should be appended when position is "none"' );
	}

	public function testOnSkinAfterBottomScriptsAppendsHtmlWhenPositionIsTop(): void {
		$hooks = $this->makeHooks( [ 'AccessibilityToolbarPosition' => 'top' ] );

		$text = '';
		$hooks->onSkinAfterBottomScripts( $this->createMock( Skin::class ), $text );

		$this->assertNotSame( '', $text, 'HTML should be appended when position is "top"' );
	}
}
