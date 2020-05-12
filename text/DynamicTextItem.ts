import { DataManager } from "../data";
import { Asserts } from "../util";
import { IDynamicText } from "./IDynamicText";
import { ITextItem } from "./ITextItem";
import { TextManager } from "./TextManager";
import { TextTextItemPair } from "./TextTextItemPair";
import { TextValuePair } from "./TextValuePair";

export class DynamicTextItem implements ITextItem
{
	private readonly data: Array< IDynamicText >;
	private readonly original: string;
	private cachedText: string;
	private postfix: string = "";

	/**
	 *
	 */
	public constructor( text: string )
	{
		this.cachedText = "";
		this.data = new Array< IDynamicText >();
		this.original = text;
	}

	/**
	 *
	 */
	public Init( dataManager: DataManager, textManager: TextManager ): void
	{
		const pairs = this.original.split( "}" );
		pairs.forEach( ( pair ) =>
		{
			if( pair.indexOf( "{" ) >= 0 )
			{
				const parts = pair.split( "{" );
				Asserts.Assert( parts.length === 2, "Illformatted TextItem: " + this.original );

				const valueParameters = parts[ 1 ].split( "," ).map( ( value ) => value.trim() );
				if( valueParameters[ 0 ] === "Value" || valueParameters[ 0 ] === "Money" )
				{
					Asserts.Assert( valueParameters.length === 2 || valueParameters.length === 3, "Illformatted Data TextItem: " + this.original );
					this.data.push( new TextValuePair( parts[ 0 ], dataManager.GetRead( valueParameters[ 0 ], valueParameters[ 1 ], valueParameters[ 2 ] ) ) );
				}
				else if( valueParameters[ 0 ] === "Text" )
				{
					Asserts.Assert( valueParameters.length === 2, "Illformatted Text TextItem: " + this.original );
					this.data.push( new TextTextItemPair( parts[ 0 ], textManager.Get( valueParameters[ 1 ] ) ) );
				}
				else
				{
					Asserts.Assert( false, "Data type must be \"Money\", \"Value\" or a text item \"Text\"." );
				}
			}
			else
			{
				Asserts.Assert( this.postfix.length === 0 );
				this.postfix = pair;
			}
		} );
	}

	/**
	 *
	 */
	public GetText(): string
	{
		const needsUpdate = this.data.some( ( pair ) => pair.NeedsUpdate() );
		if( needsUpdate )
		{
			let text = "";
			this.data.forEach( ( pair ) =>
			{
				text = text + pair.GetText();
			} );
			this.cachedText = text + this.postfix;
		}
		return this.cachedText;
	}
}
