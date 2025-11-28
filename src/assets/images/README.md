# Images Folder

This folder is for storing static images used throughout the website.

## Recommended Image Categories:

- **destinations/** - Destination photos for cards and hero sections
- **experiences/** - Experience and activity photos
- **cultural/** - Cultural highlights and local experiences
- **team/** - Team member photos (if using real photos instead of emojis)
- **hero/** - Hero section background images
- **icons/** - Custom icons and logos

## Image Optimization Tips:

1. Use WebP format for better compression
2. Keep hero images under 500KB
3. Optimize card images to 400x300px or similar
4. Use lazy loading for images below the fold
5. Provide alt text for accessibility

## Example Usage:

```jsx
import heroImage from './assets/images/hero/mountain-sunset.jpg'

<img src={heroImage} alt="Mountain sunset" />
```

For now, the components use gradient placeholders and emojis.
Replace these with actual images when available.
