import { Howl, HowlOptions } from "howler";
import { DataManager } from "../data";
import { EventManager } from "../engine";
import { Asserts, DeferredPromise, IJSONObject, JSONUtil, MapUtil } from "../util";

export class SoundGroup
{

	/**
	 *
	 */
	public static FromConfig( config: IJSONObject, server: string, dataManager: DataManager, eventManager: EventManager ): SoundGroup
	{
		const groupConfig = JSONUtil.AsType< ISoundGroupConfig >( config );
		const isMusic = !!groupConfig.StartSong;
		const soundGroup = new SoundGroup( server );

		// register sounds
		groupConfig.Sounds.forEach( ( sound ) => soundGroup.AddSound( sound.Id, sound.Sources, isMusic ) );

		// set volume
		if( !!groupConfig.VolumeData )
		{
			const volume = dataManager.GetRead( "Value", groupConfig.VolumeData );
			soundGroup.SetVolume( volume.Get() );
			volume.OnChange( ( value ) => soundGroup.SetVolume( value ) );
		}
		else
		{
			soundGroup.SetVolume( 1.0 );
		}

		// register play events
		if( !!groupConfig.EventId )
		{
			eventManager.Subscribe( groupConfig.EventId, ( eventId, args ) =>
			{
				Asserts.Assert( !!args && args.length > 0, "Sound event missing arguments!" );
				const sound = args[0] as string;
				if( isMusic )
				{
					soundGroup.PlayMusic( sound );
				}
				else
				{
					const promise = soundGroup.Play( sound );
					if( args.length > 1 )
					{
						promise.then( () => eventManager.Send( { EventId: eventId, Params: args.slice( 1 ) } ) );
					}
				}
			} );
		}

		if( !!groupConfig.StartSong )
		{
			soundGroup.PlayMusic( groupConfig.StartSong );
		}

		return soundGroup;
	}

	private readonly sounds: Map< string, Howl >;
	private readonly server: string;
	private volume: number;
	private loaded: boolean;
	private currentMusic: string;

	/**
	 *
	 */
	public constructor( server: string )
	{
		this.sounds = new Map< string, Howl >();
		this.server = server;
		this.volume = 0;
		this.loaded = true;
		this.currentMusic = "";
	}

	/**
	 *
	 */
	public Play( id: string ): Promise< void >
	{
		if( this.volume < 0.01 )
		{
			return Promise.resolve();
		}
		const promise = DeferredPromise.Create< void >();
		const sound = MapUtil.AssertedGet( this.sounds, id, "Sound not found!" );
		const instanceId = sound.play();
		sound.once( "end", ( soundId ) => promise.Resolve(), instanceId );
		return promise.Promise;
	}

	/**
	 *
	 */
	public PlayMusic( id: string ): void
	{
		if( this.volume >= 0.01 && id !== "" )
		{
			const sound = MapUtil.AssertedGet( this.sounds, id, "Sound not found!" );
			if( this.currentMusic === id )
			{
				if( !sound.playing() )
				{
					sound.play();
				}
			}
			else
			{
				if( this.currentMusic !== "" )
				{
					const current = MapUtil.AssertedGet( this.sounds, id, "Sound not found!" );
					current.stop(); // TODO: fade out
				}
				sound.play();
			}
		}
		this.currentMusic = id;
	}

	/**
	 *
	 */
	public SetVolume( volume: number )
	{
		if( this.volume === volume )
		{
			return;
		}

		if( volume > 0.01 )
		{
			this.Load();
		}

		this.sounds.forEach( ( sound ) => sound.volume( volume ) );
		this.volume = volume;
		this.PlayMusic( this.currentMusic );
	}

	/**
	 *
	 */
	public Pause(): void
	{
		if( this.currentMusic !== "" )
		{
			this.sounds.forEach( ( sound ) => sound.pause() );
		}
	}

	/**
	 *
	 */
	public Resume(): void
	{
		this.PlayMusic( this.currentMusic );
	}

	/**
	 *
	 */
	private Load()
	{
		if( this.loaded )
		{
			return;
		}

		this.sounds.forEach( ( sound ) => sound.load() );
		this.loaded = true;
	}

	/**
	 *
	 */
	private AddSound( id: string, sources: Array< string >, loop: boolean = false )
	{
		sources = sources.map( ( value ) => this.server + value );
		const howlOptions: HowlOptions =
		{
			src: sources,
			preload: false,
			loop: loop,
		};
		this.sounds.set( id, new Howl( howlOptions ) );
		this.loaded = false;
	}
}

interface ISoundGroupConfig
{
	StartSong?: string;
	VolumeData: string;
	EventId: string;
	Sounds: Array< ISoundDataConfig >;
}

interface ISoundDataConfig
{
	Id: string;
	Sources: Array< string >;
}
