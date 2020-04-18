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
				const parts = pair.split( "{" );
				Asserts.Assert( parts.length === 2, "Illformatted TextItem: " + text );

				const valueParameters = parts[1].split( "," ).map( ( value ) => value.trim() );
				Asserts.Assert( valueParameters.length === 2 || valueParameters.length === 3, "Illformatted TextItem: " + text );
				Asserts.Assert( valueParameters[ 0 ] === "Value" || valueParameters[ 0 ] === "Money", "Data type must be \"Money\" or \"Value\"." );

				this.data.push( new TextValuePair( parts[ 0 ], dataManager.GetRead( valueParameters[ 0 ], valueParameters[ 1 ], valueParameters[ 2 ] ) ) );
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
