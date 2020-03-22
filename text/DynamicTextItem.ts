import { DataManager, IDataRead } from "../data";
import { Asserts } from "../util";
import { ITextItem } from "./ITextItem";
import { TextValuePair } from "./TextValuePair";

export class DynamicTextItem implements ITextItem
{
	private readonly data: Array< TextValuePair >;
	private cachedText: string;
	private postfix: string = "";

	/**
	 *
	 */
	public constructor( text: string, dataManager: DataManager )
	{
		this.cachedText = "";
		this.data = new Array< TextValuePair >();

		const pairs = text.split( "}" );
		pairs.forEach( ( pair ) =>
		{
			if( pair.indexOf( "{" ) >= 0 )
			{
				const parts = new RegExp( "([^{]*){([^,]+),(.+)" ).exec( pair );
				Asserts.AssertNotNull( parts, "Illformatted TextItem: " + text );
				Asserts.Assert( parts.length === 4, "Illformatted TextItem: " + text );
				this.data.push( new TextValuePair( parts[ 1 ], dataManager.GetRead( parts[ 2 ], parts[ 3 ] ) ) );
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
