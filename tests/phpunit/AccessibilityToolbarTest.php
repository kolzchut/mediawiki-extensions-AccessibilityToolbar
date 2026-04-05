<?php

namespace MediaWiki\Extension\AccessibilityToolbar\Tests;

use MediaWiki\Config\Config;
use MediaWiki\Extension\AccessibilityToolbar\AccessibilityToolbar;
use MediaWiki\Title\TitleFactory;
use MediaWikiUnitTestCase;
use MWException;

/**
 * @covers \MediaWiki\Extension\AccessibilityToolbar\AccessibilityToolbar
 */
class AccessibilityToolbarTest extends MediaWikiUnitTestCase {

	private function makeConfig( array $values ): Config {
		$config = $this->createMock( Config::class );
		$config->method( 'get' )->willReturnCallback(
			static function ( string $key ) use ( $values ) {
				return $values[$key] ?? null;
			}
		);
		return $config;
	}

	public function testGetHtmlReturnsStringForTopPosition(): void {
		$config = $this->makeConfig( [
			'AccessibilityToolbarPosition' => 'top',
			'AccessibilityToolbarIconColor' => null,
		] );
		$toolbar = new AccessibilityToolbar( $config, $this->createMock( TitleFactory::class ) );

		$this->assertIsString( $toolbar->getHtml() );
		$this->assertNotSame( '', $toolbar->getHtml() );
	}

	public function testGetHtmlReturnsStringForBottomPosition(): void {
		$config = $this->makeConfig( [
			'AccessibilityToolbarPosition' => 'bottom',
			'AccessibilityToolbarIconColor' => null,
		] );
		$toolbar = new AccessibilityToolbar( $config, $this->createMock( TitleFactory::class ) );

		$this->assertIsString( $toolbar->getHtml() );
	}

	public function testThrowsOnInvalidPosition(): void {
		$config = $this->makeConfig( [
			'AccessibilityToolbarPosition' => 'invalid',
			'AccessibilityToolbarIconColor' => null,
		] );

		$this->expectException( MWException::class );
		new AccessibilityToolbar( $config, $this->createMock( TitleFactory::class ) );
	}

	public function testIconColorAppliedWhenValidHex(): void {
		$config = $this->makeConfig( [
			'AccessibilityToolbarPosition' => 'top',
			'AccessibilityToolbarIconColor' => '#abc',
		] );
		$toolbar = new AccessibilityToolbar( $config, $this->createMock( TitleFactory::class ) );

		$this->assertStringContainsString( '#abc', $toolbar->getHtml() );
	}

	public function testIconColorIgnoredWhenInvalidHex(): void {
		$config = $this->makeConfig( [
			'AccessibilityToolbarPosition' => 'top',
			'AccessibilityToolbarIconColor' => 'notacolor',
		] );
		$toolbar = new AccessibilityToolbar( $config, $this->createMock( TitleFactory::class ) );

		$this->assertStringNotContainsString( 'notacolor', $toolbar->getHtml() );
	}
}
