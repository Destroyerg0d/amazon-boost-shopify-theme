# Shopify Theme Deployment Guide

This guide will walk you through deploying your Amazon Boost Shopify theme to a live Shopify store.

## Prerequisites

- A Shopify store (paid plan required for custom themes)
- Shopify CLI installed (optional but recommended)
- Git repository set up (for version control)

## Step 1: Prepare Your Theme Files

### Option A: Using Shopify CLI (Recommended)

1. **Install Shopify CLI**:
   ```bash
   npm install -g @shopify/cli @shopify/theme
   ```

2. **Login to your Shopify store**:
   ```bash
   shopify auth login
   ```

3. **Create a new theme**:
   ```bash
   shopify theme init amazon-boost-theme
   cd amazon-boost-theme
   ```

4. **Copy theme files**:
   Replace the default files with your custom theme files:
   - Copy `theme.liquid` to the root
   - Copy `index.liquid` to the root
   - Copy `sections/` directory
   - Copy `assets/` directory
   - Copy `config/` directory

### Option B: Manual Preparation

1. **Create theme directory structure**:
   ```
   amazon-boost-theme/
   ├── assets/
   ├── config/
   ├── sections/
   ├── index.liquid
   └── theme.liquid
   ```

2. **Copy all theme files** to their respective directories

## Step 2: Test Your Theme Locally

### Using Shopify CLI

1. **Start development server**:
   ```bash
   shopify theme dev
   ```

2. **Preview your theme**:
   - Open the provided preview URL
   - Test all sections and functionality
   - Check mobile responsiveness

### Manual Testing

1. **Zip your theme directory**
2. **Upload to Shopify admin**:
   - Go to Online Store → Themes
   - Click "Add theme" → "Upload theme"
   - Select your zip file
   - Preview the theme

## Step 3: Deploy to Production

### Method 1: Shopify CLI Deployment

1. **Push theme to store**:
   ```bash
   shopify theme push
   ```

2. **Publish the theme**:
   ```bash
   shopify theme publish
   ```

### Method 2: Manual Upload

1. **Zip your theme directory**
2. **Upload to Shopify**:
   - Go to Online Store → Themes
   - Click "Add theme" → "Upload theme"
   - Upload your zip file
   - Click "Publish" to make it live

## Step 4: Configure Theme Settings

1. **Access theme customizer**:
   - Go to Online Store → Themes
   - Click "Customize" on your active theme

2. **Configure sections**:
   - **Hero Section**: Update title, subtitle, CTAs
   - **Reader Community**: Customize features and stats
   - **Process Timeline**: Edit step descriptions
   - **Pricing**: Update prices and features
   - **Testimonials**: Add real customer reviews
   - **Contact**: Update contact information

3. **Customize colors and typography**:
   - Use the theme settings panel
   - Adjust to match your brand colors
   - Set appropriate fonts

## Step 5: Set Up Domain and SEO

1. **Configure domain**:
   - Go to Settings → Domains
   - Add your custom domain
   - Set up SSL certificate

2. **SEO optimization**:
   - Update page titles and meta descriptions
   - Add structured data markup
   - Optimize images with alt text
   - Set up Google Analytics

## Step 6: Test Everything

### Functionality Testing

- [ ] Contact form submission
- [ ] Mobile responsiveness
- [ ] Page loading speed
- [ ] Cross-browser compatibility
- [ ] SEO elements
- [ ] Social media links

### Content Review

- [ ] All text is accurate and up-to-date
- [ ] Images are optimized
- [ ] Links work correctly
- [ ] Contact information is correct
- [ ] Pricing is current

## Step 7: Launch Checklist

### Pre-Launch

- [ ] Theme is published and active
- [ ] All sections are customized
- [ ] Contact form is working
- [ ] Analytics are set up
- [ ] Social media accounts are linked
- [ ] Legal pages are added (Privacy Policy, Terms of Service)

### Post-Launch

- [ ] Monitor website performance
- [ ] Check for any broken links
- [ ] Test contact form submissions
- [ ] Review analytics data
- [ ] Gather user feedback

## Troubleshooting

### Common Issues

1. **Theme not uploading**:
   - Check file structure is correct
   - Ensure all required files are present
   - Verify file permissions

2. **Sections not appearing**:
   - Check section files are in correct location
   - Verify section names match index.liquid
   - Clear browser cache

3. **Styling issues**:
   - Check CSS file is properly linked
   - Verify color settings in theme customizer
   - Test on different browsers

4. **JavaScript errors**:
   - Check browser console for errors
   - Verify JavaScript file is loaded
   - Test functionality step by step

### Getting Help

- **Shopify Support**: Contact Shopify support for technical issues
- **Theme Documentation**: Refer to README_SHOPIFY.md
- **Community Forums**: Check Shopify community for solutions

## Maintenance

### Regular Updates

- Monitor theme performance
- Update content regularly
- Test functionality monthly
- Backup theme files
- Keep track of changes

### Version Control

- Use Git for version control
- Create branches for major changes
- Document all customizations
- Keep backup of working versions

## Security Considerations

- Keep Shopify admin credentials secure
- Use strong passwords
- Enable two-factor authentication
- Regularly update theme files
- Monitor for suspicious activity

## Performance Optimization

- Optimize images before uploading
- Minimize CSS and JavaScript
- Use lazy loading for images
- Enable browser caching
- Monitor page load times

## Support Resources

- [Shopify Theme Development](https://shopify.dev/themes)
- [Liquid Template Language](https://shopify.dev/docs/themes/liquid)
- [Shopify CLI Documentation](https://shopify.dev/docs/themes/tools/cli)
- [Theme Kit Documentation](https://shopify.github.io/themekit/)

---

**Congratulations!** Your Amazon Boost Shopify theme is now live and ready to help authors get authentic book reviews. 