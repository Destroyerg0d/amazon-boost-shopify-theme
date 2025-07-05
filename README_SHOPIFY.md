# Amazon Boost Shopify Theme

A modern, responsive Shopify theme designed for ARC (Advanced Reader Copy) review services. This theme converts your Lovable React application into a fully functional Shopify store with customizable sections and modern design.

## Features

- **Responsive Design**: Mobile-first approach with beautiful layouts on all devices
- **Customizable Sections**: Easy-to-edit sections for hero, community, process, pricing, testimonials, and contact
- **Modern UI/UX**: Clean, professional design with smooth animations and interactions
- **Shopify Integration**: Full Shopify compatibility with cart, checkout, and admin customization
- **SEO Optimized**: Built with SEO best practices in mind
- **Fast Loading**: Optimized for performance and speed
- **Accessibility**: WCAG compliant with proper focus states and screen reader support

## Theme Structure

```
├── assets/
│   ├── base.css          # Main stylesheet
│   └── global.js         # JavaScript functionality
├── config/
│   ├── settings_schema.json  # Theme customization options
│   └── settings_data.json    # Default settings values
├── sections/
│   ├── hero-section.liquid           # Hero banner section
│   ├── reader-community-section.liquid # Community features
│   ├── process-timeline-section.liquid # How it works
│   ├── pricing-section.liquid        # Pricing packages
│   ├── testimonials-section.liquid   # Customer reviews
│   └── contact-section.liquid        # Contact form
├── index.liquid          # Homepage template
└── theme.liquid          # Main layout file
```

## Installation

### Method 1: Shopify CLI (Recommended)

1. Install Shopify CLI:
   ```bash
   npm install -g @shopify/cli @shopify/theme
   ```

2. Login to your Shopify store:
   ```bash
   shopify auth login
   ```

3. Create a new theme:
   ```bash
   shopify theme init amazon-boost-theme
   ```

4. Copy all files from this repository to your theme directory

5. Push the theme to your store:
   ```bash
   shopify theme push
   ```

### Method 2: Manual Upload

1. Download all theme files
2. Zip the entire theme directory
3. Go to your Shopify admin → Online Store → Themes
4. Click "Add theme" → "Upload theme"
5. Select your zip file and upload

## Customization

### Theme Settings

Access theme customization through:
1. Shopify Admin → Online Store → Themes
2. Click "Customize" on your active theme
3. Use the theme editor to modify:
   - Colors and typography
   - Layout settings
   - Button styles
   - Card designs
   - Form styling

### Section Customization

Each section can be customized individually:

#### Hero Section
- Hero title and subtitle
- Call-to-action buttons
- Badge text and stats
- Background colors and animations

#### Reader Community Section
- Section title and description
- Feature cards (4 customizable features)
- Statistics display
- Icon and color customization

#### Process Timeline Section
- Step-by-step process description
- Custom step titles and descriptions
- Timeline styling and colors

#### Pricing Section
- Three pricing tiers (Starter, Professional, Premium)
- Custom pricing and features
- Package descriptions
- CTA buttons

#### Testimonials Section
- Customer testimonials (3 customizable)
- Star ratings
- Author information
- Success statistics

#### Contact Section
- Contact form fields
- Contact information (email, phone, address)
- Form styling and validation
- Success messages

### Code Customization

For advanced customization:

1. **CSS**: Edit `assets/base.css` for global styles
2. **JavaScript**: Modify `assets/global.js` for functionality
3. **Sections**: Edit individual `.liquid` files in the `sections/` directory
4. **Layout**: Modify `theme.liquid` for overall page structure

## Deployment

### GitHub Integration

1. Create a new GitHub repository
2. Push your theme files to the repository
3. Connect your Shopify store to GitHub:
   - Go to Shopify Admin → Settings → Apps and sales channels
   - Install "GitHub" app
   - Connect your repository
   - Set up automatic deployments

### Manual Deployment

1. Make changes to your theme files
2. Zip the theme directory
3. Upload to Shopify admin
4. Preview and publish changes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

The theme is optimized for:
- Fast loading times
- Mobile performance
- SEO best practices
- Accessibility standards

## Support

For support and customization requests:
- Create an issue in the GitHub repository
- Contact the theme developer
- Check Shopify's theme documentation

## License

This theme is licensed under the MIT License. See LICENSE file for details.

## Changelog

### Version 1.0.0
- Initial release
- Responsive design
- Customizable sections
- Shopify integration
- Modern UI/UX

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Credits

- Design inspired by modern SaaS landing pages
- Built with Shopify Liquid templating
- Icons from Lucide React
- Fonts from Google Fonts
- Animations and interactions optimized for performance 