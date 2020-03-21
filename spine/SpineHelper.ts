import { spine } from "esotericsoftware-spine";
import { mat4 } from "gl-matrix";
import { MeshAttachment } from "./MeshAttachment";
import { NodeAttachment } from "./NodeAttachment";
import { RegionAttachment } from "./RegionAttachment";

export class SpineHelper
{
	/**
	 *
	 */
	public static BoneToMatrix( bone: spine.Bone, matrix: mat4 = mat4.create() ): mat4
	{
		mat4.set( matrix,
				bone.a, bone.b, 0, 0,
				bone.c, bone.d, 0, 0,
				0, 0, 1, 0,
				bone.worldX, bone.worldY, 0, 1 );

		return matrix;
	}

	/**
	 *
	 */
	public static SetColorMatrix( skeleton: spine.Skeleton, slot: spine.Slot, attachment: RegionAttachment | MeshAttachment | NodeAttachment, matrix: mat4 = mat4.create() ): mat4
	{
		const a = skeleton.color.a * slot.color.a * attachment.color.a;
		const r = skeleton.color.r * slot.color.r * attachment.color.r * a;
		const g = skeleton.color.g * slot.color.g * attachment.color.g * a;
		const b = skeleton.color.b * slot.color.b * attachment.color.b * a;

		mat4.set( matrix,
			r, 0, 0, 0,
			0, g, 0, 0,
			0, 0, b, 0,
			0, 0, 0, a );

		return matrix;
	}

	/**
	 *
	 */
	public static IsVisible( transform: mat4, color: mat4 ): boolean
	{
		const alpha = ( color[ 15 ] > 0.001 );
		const scale = ( transform[ 0 ] * transform[ 5 ] * transform[ 10 ] !== 0 );
		return alpha && scale;
	}
}
