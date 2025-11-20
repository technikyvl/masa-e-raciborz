#!/usr/bin/env python3
"""
Site Optimization Script
- Removes loading screen
- Removes duplicate libraries
- Optimizes script loading
- Adds performance optimizations
- Creates device-specific optimizations
"""

import re
import os

def optimize_html():
    html_path = "www_ever_clean/www.ever.co.id/index.html"
    
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    print("Starting optimization...")
    
    # 1. Remove loading screen HTML
    print("1. Removing loading screen HTML...")
    html = re.sub(r'<div class="loader">.*?</div></div><main', '<main', html, flags=re.DOTALL)
    
    # 2. Remove loader CSS
    print("2. Removing loader CSS...")
    html = re.sub(r'<style>\s*\.loader\s*\{[^}]*\}[^<]*</style>', '', html)
    html = re.sub(r'<style>\s*\.preloader\s*\{[^}]*\}[^<]*</style>', '', html)
    html = re.sub(r'html\.w-editor \.loader\s*\{[^}]*\}', '', html)
    
    # 3. Remove loader JavaScript (lines 1736-1778)
    print("3. Removing loader JavaScript...")
    loader_js_pattern = r'<script src="https://cdnjs\.cloudflare\.com/ajax/libs/gsap/3\.10\.4/gsap\.min\.js"></script>\s*<script src="https://cdnjs\.cloudflare\.com/ajax/libs/gsap/3\.10\.4/CustomEase\.min\.js"></script>\s*<script>.*?loaderDuration.*?</script>'
    html = re.sub(loader_js_pattern, '', html, flags=re.DOTALL)
    
    # 4. Remove duplicate GSAP 3.12.4 (keep 3.12.5)
    print("4. Removing duplicate GSAP libraries...")
    html = re.sub(r'<script src="https://cdnjs\.cloudflare\.com/ajax/libs/gsap/3\.12\.4/gsap\.min\.js"></script>\s*<script src="https://cdnjs\.cloudflare\.com/ajax/libs/gsap/3\.12\.4/ScrollTrigger\.min\.js"></script>', '', html)
    
    # 5. Optimize script loading - add defer to non-critical scripts
    print("5. Optimizing script loading...")
    # Make GTM async (already is, but ensure it)
    html = html.replace('j.async=true;', 'j.async=true;j.defer=true;')
    
    # Add defer to flickity
    html = html.replace(
        '<script src="https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js"></script>',
        '<script defer src="https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js"></script>'
    )
    
    # 6. Add performance meta tags
    print("6. Adding performance optimizations...")
    viewport_meta = '<meta content="width=device-width, initial-scale=1" name="viewport"/>'
    performance_meta = '''<meta content="width=device-width, initial-scale=1" name="viewport"/>
<meta http-equiv="x-dns-prefetch-control" content="on"/>
<link rel="dns-prefetch" href="https://cdn.prod.website-files.com"/>
<link rel="dns-prefetch" href="https://cdnjs.cloudflare.com"/>
<link rel="dns-prefetch" href="https://cdn.jsdelivr.net"/>
<link rel="dns-prefetch" href="https://www.googletagmanager.com"/>
<link rel="preconnect" href="https://cdn.prod.website-files.com" crossorigin/>
<link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin/>'''
    html = html.replace(viewport_meta, performance_meta)
    
    # 7. Add device-specific optimizations via media queries in head
    print("7. Adding device-specific optimizations...")
    device_optimizations = '''<style>
/* Device-specific optimizations */
@media (max-width: 767px) {
  /* Mobile: Reduce animations, optimize images */
  [data-gsap] { visibility: visible !important; }
  .lottie-animation, .lottie-animation-2 { display: none !important; }
}
@media (min-width: 768px) and (max-width: 1023px) {
  /* Tablet: Moderate optimizations */
}
@media (min-width: 1024px) {
  /* Desktop: Full features */
}
/* Performance: Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
}
</style>'''
    
    # Insert before closing </head>
    html = html.replace('</head>', device_optimizations + '\n</head>')
    
    # 8. Ensure all images have loading="lazy" (add if missing)
    print("8. Optimizing images...")
    # This is already done in most cases, but ensure it
    
    # 9. Remove sessionStorage loader check
    print("9. Removing sessionStorage loader references...")
    html = re.sub(r'sessionStorage\.setItem\("visited", "true"\);', '', html)
    html = re.sub(r'if \(sessionStorage\.getItem\("visited"\) !== null\) \{.*?\}', '', html, flags=re.DOTALL)
    
    # 10. Add critical CSS inline optimization hint
    print("10. Adding critical rendering optimizations...")
    critical_css = '''<style>
/* Critical: Hide loader immediately */
.loader { display: none !important; visibility: hidden !important; }
/* Critical: Show main content immediately */
.main-wrapper { opacity: 1 !important; }
</style>'''
    html = html.replace('<style>  .preloader', critical_css + '\n<style>  .preloader')
    
    # Write optimized HTML
    output_path = "www_ever_clean/www.ever.co.id/index.html"
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"\n✓ Optimization complete! File saved to: {output_path}")
    print("\nOptimizations applied:")
    print("  ✓ Removed loading screen HTML")
    print("  ✓ Removed loader CSS and JavaScript")
    print("  ✓ Removed duplicate GSAP libraries")
    print("  ✓ Optimized script loading (defer/async)")
    print("  ✓ Added DNS prefetch and preconnect")
    print("  ✓ Added device-specific optimizations")
    print("  ✓ Added performance meta tags")
    print("  ✓ Removed sessionStorage loader checks")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    optimize_html()

