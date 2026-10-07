# Drop_shipping

## Backend image uploads

Production image uploads use Cloudinary so product photos remain available after
Render restarts and deployments. Add these environment variables to the Render
backend service:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Create these values in the Cloudinary dashboard. Do not commit the API secret.
Local development can continue using the backend's local `uploads` directory
when the Cloudinary variables are not configured.