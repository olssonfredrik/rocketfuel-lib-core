import { EventManager } from "../engine";
import { Asserts, IJSONObject, JSONUtil, Logging, MapUtil } from "../util";
import { DataValue } from "./DataValue";
import { DataValueFormat } from "./DataValueFormat";
import { IDataRead } from "./IDataRead";
import { IDataWrite } from "./IDataWrite";
import { DataViewLinear } from "./views/DataViewLinear";
import { IDataView } from "./views/IDataView";

export class DataManager
{
	private map: Map< string, DataValue >;
	private views: Map< string, IDataView >;
	private readonly moneyPrefix: string;
	private readonly valuePrefix: string;

	/**
	 *
	 */
	public constructor()
	{
		this.map = new Map< string, DataValue >();
		this.views = new Map< string, IDataView >();
		this.moneyPrefix = "Money:";
		this.valuePrefix = "Value:";
	}

	/**
	 *
	 */
	public GetRead( type: "Value" | "Money", id: string, view: string = "" ): IDataRead< number >
	{
		const key = type + ":" + id;
		Asserts.Assert( this.map.has( key ), "No data available of type: \"" + type + "\" with id: \"" + id +"\"" );
		if( view.length > 0 )
		{
			const viewKey = key + "," + view;
			return MapUtil.AssertedGet( this.views, viewKey, "No view available with name: \"" + view + "\"" );
		}
		return MapUtil.AssertedGet( this.map, key );
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
	public Update( deltaTime: number ): void
	{
		this.views.forEach( ( view ) => view.Update( deltaTime ) );
	}

	/**
	 *
	 */
	public Init( data: IJSONObject, eventManager: EventManager )
	{
		const dataObject = JSONUtil.AsType< IDataManagerConfig >( data );

		Object.keys( dataObject.Money ).forEach( ( key ) =>
		{
			const value = JSONUtil.GetAssertedAsType< IMoneyConfig >( dataObject.Money, key );
			const name = this.moneyPrefix + key;
			const moneyValue = new DataValue( 0, DataValueFormat.Money );
			this.map.set( name, moneyValue );
			this.CreateViews( name, moneyValue, value.Views );
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

			this.CreateViews( name, dataValue, value.Views );
		} );

		eventManager.Subscribe( "DataManager:RestartView", ( eventId, args ) =>
		{
			Asserts.AssertDefined( args, "No parameters defined" );
			Asserts.Assert( args.length === 3, "Incorrect number of parameters to \"DataManager:RestartView\" event." );
			const id = args[ 0 ] + ":" + args[ 1 ] + "," + args[ 2 ];
			this.views.get( id )?.Restart();
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

	/**
	 *
	 */
	private CreateViews( name: string, value: IDataRead< number >, viewConfigMap?: IJSONObject )
	{
		Object.keys( viewConfigMap ?? {} ).forEach( ( key ) =>
		{
			const config = JSONUtil.GetAssertedAsType< IJSONObject >( viewConfigMap ?? {}, key );
			const viewName = name + "," + key;
			const dataView = new DataViewLinear( value, config );
			this.views.set( viewName, dataView );
		} );
	}
}

interface IDataManagerConfig
{
	Money: IJSONObject;
	Values: IJSONObject;
}

interface IMoneyConfig
{
	Views?: IJSONObject;
}

interface IValueConfig
{
	Format: DataValueFormat;
	Persistent: boolean;
	InitialValue?: number;
	MaxValue?: number;
	Views?: IJSONObject;
}

interface IViewConfig
{
	Type: string;
}
