import { EventManager } from "../engine";
import { Asserts, IJSONObject, JSONUtil, Logging, MapUtil } from "../util";
import { DataValue, DataValueFormat } from "./DataValue";
import { IDataRead } from "./IDataRead";
import { IDataWrite } from "./IDataWrite";

export class DataManager
{
	private map: Map< string, DataValue >;
	private readonly moneyPrefix: string;
	private readonly valuePrefix: string;

	/**
	 *
	 */
	public constructor()
	{
		this.map = new Map< string, DataValue >();
		this.moneyPrefix = "Money:";
		this.valuePrefix = "Value:";
	}

	/**
	 *
	 */
	public GetRead( type: "Value" | "Money", id: string ): IDataRead< number >
	{
		const key = type + ":" + id;
		const data = MapUtil.AssertedGet( this.map, key, "No data available of type: \"" + type + "\" with id: \"" + id +"\"" );
		return data;
	}

	/**
	 *
	 */
	public GetWrite( type: "Value" | "Money", id: string ): IDataWrite< number >
	{
		const key = type + ":" + id;
		const data = MapUtil.AssertedGet( this.map, key, "No data available of type: \"" + type + "\" with id: \"" + id +"\"" );
		return data;
	}

	/**
	 *
	 */
	public Init( data: IJSONObject, eventManager: EventManager )
	{
		const dataObject = JSONUtil.AsType< IDataManagerConfig >( data );

		Object.keys( dataObject.Money ).forEach( ( key ) =>
		{
			const name = this.moneyPrefix + key;
			this.map.set( name, new DataValue( 0, DataValueFormat.Money ) );
		} );

		Object.keys( dataObject.Values ).forEach( ( key ) =>
		{
			const value = JSONUtil.GetAssertedAsType< IValueConfig >( dataObject.Values, key );

			const name = this.valuePrefix + key;
			let initialValue = value.InitialValue ?? 0;
			if( value.Persistent )
			{
				try
				{
					const storedValue = window.localStorage.getItem( name );
					if( storedValue !== null && storedValue.length > 0 )
					{
						initialValue = Number.parseFloat( storedValue );
					}
				}
				catch( e )
				{
					Logging.Log( "Failed to read value from local storage: \"" + name + "\"" );
				}
			}
			const dataValue = new DataValue( initialValue, value.Format, value.MaxValue ?? -1 );
			if( value.Persistent )
			{
				dataValue.OnChange( ( newValue: number ) =>
				{
					window.localStorage.setItem( name, newValue.toString( 10 ) );
				} );
			}
			this.map.set( name, dataValue );
		} );

		eventManager.Subscribe( "DataManager:SetValue", ( eventId, args ) =>
		{
			Asserts.AssertDefined( args, "No parameters defined" );
			Asserts.Assert( args.length === 2, "Incorrect number of parameters to \"DataManager:SetValue\" event." );
			const write = this.GetWrite( "Value", args[ 0 ] as string );
			write.Set( args[ 1 ] as number );
		} );
		eventManager.Subscribe( "DataManager:StepValue", ( eventId, args ) =>
		{
			Asserts.AssertDefined( args, "No parameters defined" );
			Asserts.Assert( args.length === 1, "Incorrect number of parameters to \"DataManager:StepValue\" event." );
			this.GetWrite( "Value", args[ 0 ] as string ).Step();
		} );
	}
}

interface IDataManagerConfig
{
	Money: IJSONObject;
	Values: IJSONObject;
}

interface IValueConfig
{
	Format: DataValueFormat;
	Persistent: boolean;
	InitialValue?: number;
	MaxValue?: number;
}
