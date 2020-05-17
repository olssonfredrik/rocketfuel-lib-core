import { EventManager } from "../engine";
import { Asserts } from "./Asserts";
import { DeferredPromise } from "./DeferredPromise";

export class PromiseUtil
{
	/**
	 *
	 */
	public static Delay< T = any >( duration: number, value?: T ): Promise< T >
	{
		const promise = DeferredPromise.Create< T >();
		PromiseUtil.activePromises.push( { Time: duration, Resolve: () => promise.Resolve( value ) } );
		return promise.Promise;
	}

	/**
	 *
	 */
	public static Init( eventManager: EventManager ): void
	{
		eventManager.Subscribe( "Engine:EndFrame", ( eventId, args ) =>
		{
			Asserts.AssertDefined( args, "No parameters defined" );
			this.Update( args[ 0 ] as number );
		} );
	}

	private static activePromises = new Array< IDelayedPromise< any > >();

	/**
	 *
	 */
	private static Update( deltaTime: number ): void
	{
		if( PromiseUtil.activePromises.length === 0 )
		{
			return;
		}

		const list = PromiseUtil.activePromises;
		PromiseUtil.activePromises = new Array< IDelayedPromise< any > >();
		list.forEach( ( item ) =>
		{
			item.Time -= deltaTime;
			if( item.Time > 0 )
			{
				PromiseUtil.activePromises.push( item );
			}
			else
			{
				item.Resolve();
			}
		} );
	}
}

interface IDelayedPromise< T >
{
	Time: number;
	Resolve: () => void;
}
