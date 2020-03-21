import { mat4 } from "gl-matrix";

export class Transform
{
	private isDirty: boolean = false;
	private parent?: Transform = undefined;
	private local: mat4 = mat4.create();
	private global: mat4 = mat4.create();

	/**
	 * Copies the given matrix into this MatrixStackItem internal local matrix.
	 * This automatically flags the matrix as dirty.
	 */
	public Set( matrix: mat4 ): void
	{
		mat4.copy( this.local, matrix );
		this.isDirty = true;
	}

	/**
	 *
	 */
	public Get(): mat4
	{
		if( this.parent === undefined )
		{
			return this.local;
		}
		else if( this.isDirty )
		{
			const parentMatrix = this.parent.Get();
			mat4.multiply( this.global, parentMatrix, this.local );
			this.isDirty = false;
		}

		return this.global;
	}

	/**
	 * Copies the given matrix into this MatrixStackItem internal global matrix.
	 * This automatically flags the matrix as clean.
	 */
	public SetGlobal( matrix: mat4 ): void
	{
		mat4.copy( this.global, matrix );
		this.isDirty = false;
	}

	/**
	 * Get a reference to the local matrix. Remember to set dirty, if changed!
	 */
	public GetLocal(): mat4
	{
		return this.local;
	}

	/**
	 *
	 */
	public SetParent( transform: Transform )
	{
		// TODO: Couldnt get this to work because it seems sometimes the parent
		// is the same and has changed but isn't dirty?
		// this.isDirty = this.isDirty || transform.isDirty || (this.parent != transform);
		this.isDirty = true;

		this.parent = transform;
	}

	/**
	 *
	 */
	public SetDirty(): void
	{
		this.isDirty = true;
	}

}
