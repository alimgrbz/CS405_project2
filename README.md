# CS405 Project 2 

### Task 1: Texture Handling Enhancement

#### `setTexture` Method Modification

- **Objective**: To ensure textures not having power-of-two dimensions are handled correctly.
- **Implementation**:
  - When a texture is not a power of two, the texture wrapping is set to `CLAMP_TO_EDGE`, and the texture filtering is set to `LINEAR`. This approach enables the use of non-power-of-two textures without generating mipmaps.
  - `gl.TEXTURE_WRAP_S` and `gl.TEXTURE_WRAP_T` are set to `gl.CLAMP_TO_EDGE` to prevent texture wrapping.
  - `gl.TEXTURE_MIN_FILTER` is set to `gl.LINEAR` for linear filtering of textures.

### Task 2: Basic Lighting Implementation

#### 1. Constructor Modifications

- **Enhancements**:
  - Lighting-related uniform locations (`lightPosLoc`, `lightColorLoc`, `ambientIntensityLoc`, `enableLightingLoc`) are retrieved and stored.
  - Default values for lighting properties (`lightPos`, `lightColor`, `lightIntensity`, `enableLighting`) are initialized.
  - A buffer for normals (`normbuffer`) is created, which is essential for lighting calculations.

#### 2. Modification in `setMesh` Function

- **Functionality**:
  - Alongside setting vertex positions and texture coordinates, the function now also binds and sets data for normal vectors (`normalCoords`), crucial for lighting calculations.

#### 3. Modification in `draw` Function

- **Key Points**:
  - Sets the uniform values for lighting before drawing the mesh.
  - Lighting can be enabled or disabled based on the `enableLighting` property.

#### 4. Modification in Fragment Shader (`meshFS`)

- **Shader Enhancements**:
  - The fragment shader now includes calculations for lighting: It normalizes the normal vectors and computes the light direction.
  - Calculates the diffuse lighting effect based on the dot product of the light direction and the normal vector.
  - Combines ambient and diffuse lighting effects with the texture color.

#### 5. Functions `enableLighting` and `setAmbientLight`

- **Capabilities**:
  - These functions allow for enabling/disabling the lighting and setting the ambient light intensity, respectively.

---
