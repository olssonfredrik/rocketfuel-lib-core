import { Logging } from "../util";

export class EventManager
{
	private readonly subscriptions = new Map< string, Map< string, EventFunction > >();
	private events: Array< IEvent > = new Array< IEvent >();
	private count: number = 0;

	/**
	 *
	 */
	public Send( event: IEvent, logging: boolean = true )
	{
		this.events.push( event );

		if( logging )
		{
			const message = "Event:";
			if( !!event.Params )
			{
				Logging.Log( message, event.EventId, event.Params );
			}
			else
			{
				Logging.Log( message, event.EventId );
			}
		}
	}

	/**
	 *
	 */
	public Subscribe( eventId: string, eventFunction: EventFunction ): string
	{
		const subs = this.GetSubscriptions( eventId );
		const id = this.count.toString( 10 );
		this.count++;
		subs.set( id, eventFunction );
		return id;
	}

	/**
	 *
	 */
	public Unsubscribe( eventId: string, subscriptionId: string )
	{
		const subs = this.GetSubscriptions( eventId );
		subs.delete( subscriptionId );
	}

	/**
	 *
	 */
	public Flush()
	{
		if( this.events.length === 0 )
		{
			return;
		}

		const events = this.events;
		this.events = new Array< IEvent >();

		events.forEach( ( event ) =>
		{
			const subs = this.GetSubscriptions( event.EventId );
			subs.forEach( ( eventFunction ) => eventFunction( event.EventId, event.Params ) );
		} );
	}

	/**
	 *
	 */
	public TestEvents( events: Array< IEvent > )
	{
		const event = events.shift();
		if( !!event )
		{
			this.Send( event );
		}
		setTimeout( () => this.TestEvents( events ), 1000 );
	}

	/**
	 *
	 */
	private GetSubscriptions( eventId: string ): Map< string, EventFunction >
	{
		let subs = this.subscriptions.get( eventId );
		if( subs === undefined )
		{
			subs = new Map< string, EventFunction >();
			this.subscriptions.set( eventId, subs );
		}
		return subs;
	}
}

export type EventFunction = ( eventId: string, args?: Array< unknown > ) => void;

export interface IEvent
{
	EventId: string;
	Params?: Array< unknown >;
}
