import { Logging } from "../../util";
import { AlwaysShape } from "./AlwaysShape";
import { CircleShape, ICircleShapeConfig } from "./CircleShape";
import { IShape } from "./IShape";
import { NeverShape } from "./NeverShape";
import { IRectangleShapeConfig, RectangleShape } from "./RectangleShape";

export class Shape
{
	/**
	 *
	 */
	public static FromConfig( config: IShapeConfig ): IShape
	{
		switch( config.Type )
		{
			case "AlwaysShape":
				return new AlwaysShape();

			case "CircleShape":
				const circleConfig = config as ICircleShapeConfig;
				return new CircleShape( circleConfig.Radius );

			case "NeverShape":
				return new NeverShape();

			case "RectangleShape":
				const rectConfig = config as IRectangleShapeConfig;
				return new RectangleShape( rectConfig.Width, rectConfig.Height );
		}
		Logging.Error( "Unknown Shape type: \"" + config.Type +"\"" );
		return new NeverShape();
	}
}

export interface IShapeConfig
{
	Type: string;
}
