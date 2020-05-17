export class DeferredPromise< T >
{
	/**
	 *
	 */
	public static Create< T >(): DeferredPromise< T >
	{
		let resolve = ( value?: T ) => {};
		let reject = ( value?: T ) => {};
		const promise = new Promise< T >( ( res, rej ) =>
		{
			resolve = res;
			reject = rej;
		} );

		return new DeferredPromise< T >( promise, resolve, reject );
	}

	public Promise: Promise< T >;

	private resolveFunction: ( value?: T ) => void;
	private rejectFunction: ( value?: T ) => void;

	/**
	 *
	 */
	private constructor( promise: Promise< T >, resolve: ( value?: T ) => void, reject: ( value?: T ) => void )
	{
		this.Promise = promise;
		this.resolveFunction = resolve;
		this.rejectFunction = reject;
	}

	/**
	 *
	 */
	public Resolve( value?: T ): void
	{
		this.resolveFunction( value );
	}

	/**
	 *
	 */
	public Reject( value?: T ): void
	{
		this.rejectFunction( value );
	}
}
