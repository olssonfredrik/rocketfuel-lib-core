import { DataManager } from "../data";
import { Asserts, IJSONObject, JSONUtil, MapUtil } from "../util";
import { DynamicTextItem } from "./DynamicTextItem";
import { ITextItem } from "./ITextItem";
import { StaticTextItem } from "./StaticTextItem";

export class TextManager
{
	private readonly textItems: Map< string, ITextItem >;

	/**
	 *
	 */
	public constructor()
	{
		this.textItems = new Map< string, ITextItem >();
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
	public Init( locale: string, dataManager: DataManager, data: IJSONObject ): void
	{
		const config = JSONUtil.AsType< ITextManagerConfig >( data );
		const localeList = this.CreateLocaleList( locale );

		Object.keys( config.Data ).forEach( ( id: string ) =>
		{
			const textData = JSONUtil.GetAssertedAsType< ITextItemConfig >( config.Data, id );

			let text = textData.Text;
			localeList.forEach( ( loc ) => text = JSONUtil.GetOrDefault( textData.Localized, loc, text ) );

			if( text.indexOf( "{" ) >= 0 )
			{
				this.textItems.set( id, new DynamicTextItem( text, dataManager ) );
			}
			else
			{
				this.textItems.set( id, new StaticTextItem( text ) );
			}
		} );
	}

	/**
	 * Creates a prioritized list, from low to high, of locales.
	 * "en-UK" -> ["en", "en-UK"]
	 * "x-y-z" -> ["x", "x-y", "x-z", "x-y-z" ]
	 */
	private CreateLocaleList( locale: string ): Array< string >
	{
		const output = new Array< string >();

		const list = locale.split( "-" );
		if( list.length > 1 )
		{
			output.push( list[ 0 ] + "-" + list[ 1 ] );
		}
		if( list.length > 2 )
		{
			output.push( list[ 0 ] + "-" + list[ 2 ] );
		}
		output.push( locale );

		Asserts.Assert( list.length <= 3, "Locale format not supported!" );

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
}
