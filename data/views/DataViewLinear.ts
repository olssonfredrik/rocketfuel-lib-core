import { IJSONObject, JSONUtil } from "../../util";
import { DataFormatter } from "../DataFormatter";
import { DataCallback, IDataRead } from "../IDataRead";
import { IDataView } from "./IDataView";

export class DataViewLinear implements IDataView
{
	private readonly data: IDataRead< number >;
	private readonly max: number;
	private readonly up: boolean;
	private readonly down: boolean;
	private time: number;
	private newValue: number;
	private oldValue: number;

	/**
	 *
	 */
	public constructor( data: IDataRead< number >, jsonConfig: IJSONObject )
	{
		const config = JSONUtil.AsType< IDataViewLinearConfig >( jsonConfig );
		this.oldValue = data.Get();
		this.newValue = data.Get();
		this.data = data;
		this.time = 0;
		this.max = config.Duration;
		this.up = config.Up ?? true;
		this.down = config.Down ?? true;
	}

	/**
	 *
	 */
	public Update( deltaTime: number ): void
	{
		const value = this.data.Get();
		if( this.newValue !== value )
		{
			this.oldValue = this.Get();
			this.newValue = value;
			this.Restart();
		}
		this.time += deltaTime;
	}

	/**
	 *
	 */
	public Restart(): void
	{
		this.time = 0;
		if( ( !this.up && this.newValue > this.oldValue ) || ( !this.down && this.newValue < this.oldValue ) )
		{
			this.time = this.max;
		}
	}

	/**
	 *
	 */
	public Get(): number
	{
		if( this.time >= this.max )
		{
			return this.newValue;
		}
		const factor = this.time / this.max;
		return this.oldValue + factor * ( this.newValue - this.oldValue );
	}

	/**
	 *
	 */
	public GetText(): string
	{
		return this.data.GetFormatter().FormatValue( this.Get() );
	}

	/**
	 *
	 */
	public GetFormatter(): DataFormatter
	{
		return this.data.GetFormatter();
	}

	/**
	 *
	 */
	public OnChange( callback: DataCallback< number > ): void
	{
		this.data.OnChange( callback );
	}
}

interface IDataViewLinearConfig
{
	Duration: number;
	Up?: boolean;
	Down?: boolean;
}
