import { DataManager } from "../data";
import { Asserts, IJSONObject, JSONUtil, MapUtil } from "../util";
import { DynamicTextItem } from "./DynamicTextItem";
import { IMutableTextItem } from "./IMutableTextItem";
import { ITextItem } from "./ITextItem";
import { MutableTextItem } from "./MutableTextItem";
import { StaticTextItem } from "./StaticTextItem";

export class TextManager
{
	private readonly textItems: Map< string, ITextItem >;
	private readonly mutableItems: Map< string, IMutableTextItem >;

	/**
	 *
	 */
	public constructor()
	{
		this.textItems = new Map< string, ITextItem >();
		this.mutableItems = new Map< string, IMutableTextItem >();
	}

	/**
	 *
	 */
	public Get( id: string ): ITextItem
	{
		const item = MapUtil.AssertedGet( this.textItems, id, "Failed to find text with id: \"" + id + "\"." );
		return item;
	}

	/**
	 *
	 */
	public SetMutable( id: string, text: string ): void
	{
		const item = MapUtil.AssertedGet( this.mutableItems, id, "Failed to find mutable text with id: \"" + id + "\"." );
		item.SetText( text );
	}

	/**
	 *
	 */
	public Init( locale: string, dataManager: DataManager, data: IJSONObject ): void
	{
		const config = JSONUtil.AsType< ITextManagerConfig >( data );
		const localeList = this.CreateLocaleList( locale );
		const delayedInit = new Array< DynamicTextItem >();

		Object.keys( config.Data ).forEach( ( id: string ) =>
		{
			const textData = JSONUtil.GetAssertedAsType< ITextItemConfig >( config.Data, id );

			let text = textData.Text;
			localeList.forEach( ( loc ) => text = JSONUtil.GetOrDefault( textData.Localized, loc, text ) );

			if( textData.Mutable ?? false )
			{
				const item = new MutableTextItem( text );
				this.textItems.set( id, item );
				this.mutableItems.set( id, item );
			}
			else if( text.indexOf( "{" ) >= 0 )
			{
				const item = new DynamicTextItem( text );
				delayedInit.push( item );
				this.textItems.set( id, item );
			}
			else
			{
				this.textItems.set( id, new StaticTextItem( text ) );
			}
		} );

		delayedInit.forEach( ( item ) => item.Init( dataManager, this ) );
	}

	/**
	 * Creates a prioritized list, from low to high, of locales.
	 * "en-UK" -> ["en", "en-UK"]
	 * "aa-BB-x-test" -> ["aa", "aa-BB", "aa-x-test", "aa-BB-x-test" ]
	 */
	private CreateLocaleList( locale: string ): Array< string >
	{
		const [language, region, ...variant] = locale.split( "-" );

		const output = new Array< string >();
		if( !!region )
		{
			output.push( language );
		}
		if( variant.length > 0 )
		{
			output.push( language + "-" + region );
			output.push( language + "-" + variant.join( "-" ) );
		}
		output.push( locale );

		return output;
	}

}

interface ITextManagerConfig
{
	Data: IJSONObject;
}

interface ITextItemConfig
{
	Text: string;
	Localized?: IJSONObject;
	Mutable?: boolean;
}
