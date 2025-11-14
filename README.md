# rise-of-a-yn
Idle Tycoon Game - YN to Empire
# 📦 GRIND CITY - COMPLETE DELIVERABLES SUMMARY

## 🎯 WHAT YOU'RE GETTING

This package contains **everything** you need to:
1. ✅ Deploy the game to GitHub Pages
2. ✅ Get it working and loadable for friends
3. ✅ Implement a complete onboarding flow
4. ✅ Organize 145+ game images with proper file structure
5. ✅ Continue development with a clean asset map

---

## 📋 FILES INCLUDED

### 1. **GRIND_CITY_IMAGE_ASSETS.md** 📸
**Purpose:** Complete inventory of all images needed

**Contains:**
- 145 images organized by tier (1-5)
- Hustles, Businesses, Homes, Cars, Bosses
- Flex Shop items (chains, watches, pets, decor)
- UI elements and mini-game assets
- Size guidelines (128x128, 256x256, 512x512, etc.)
- Naming conventions
- Directory structure recommendation

**How to use:**
1. Share this with your designer/artist
2. They create images following the spec
3. Place images in `public/images/` folder
4. Use them with the assetMap

---

### 2. **GITHUB_PAGES_DEPLOYMENT_GUIDE.md** 🚀
**Purpose:** Complete deployment guide (THE MOST IMPORTANT FILE)

**Contains:**
- Why your game isn't loading (static export issue)
- Step-by-step setup instructions
- GitHub Actions workflow explanation
- Environment variables setup
- Troubleshooting for common issues
- Local testing instructions

**How to use:**
1. Read sections 1-6 in order
2. Follow each step carefully
3. Test locally before pushing to GitHub
4. Reference troubleshooting section if issues occur

---

### 3. **next.config.js** ⚙️
**Purpose:** Next.js configuration for static export

**Contains:**
- `output: 'export'` - enables static export
- `basePath` configuration for GitHub Pages
- Image optimization disabled (required for static)
- Trailing slash handling

**How to use:**
1. Copy this file to your project root
2. Replace your current `next.config.js`
3. Change `repoName` to your actual GitHub repo name
4. Example: `const repoName = 'grind-city';`

---

### 4. **.github_workflows_deploy.yml** 🔄
**Purpose:** GitHub Actions automation for deployment

**Contains:**
- Automatic build triggers on push
- Node 20 setup
- NPM install and build
- Artifact upload to GitHub Pages
- Full deployment workflow

**How to use:**
1. Create folder: `.github/workflows/` (if not exists)
2. Create file: `deploy.yml` in that folder
3. Copy content from this file
4. Push to GitHub - it will auto-deploy!

---

### 5. **Onboarding.tsx** 🧅
**Purpose:** Complete onboarding flow component

**Contains:**
- 5-step tutorial flow
- Username input validation
- Client-side Supabase auth integration
- Player profile creation
- Error handling
- Loading states

**How to use:**
1. Replace your current onboarding component with this
2. Import: `import Onboarding from '@/components/Onboarding'`
3. It handles everything - auth, database, redirect
4. Players see 5-step tutorial before playing

---

### 6. **assetMap.ts** 🗺️
**Purpose:** TypeScript asset mapping for all images

**Contains:**
- Complete mapping of all 145+ images
- Organized by tier and category
- Helper functions to get images dynamically
- Type-safe imports

**How to use:**
```typescript
import { ASSET_MAP, getBusinessImage } from '@/lib/assetMap';

// Option 1: Direct access
const logoImg = ASSET_MAP.ui.logo;

// Option 2: Get dynamically by tier
const hustleImg = getHustleImage(1, 0); // Tier 1, first hustle

// Option 3: Access nested objects
const chainImg = ASSET_MAP.flexShop.chains.roseGold;
```

---

### 7. **IMAGE_USAGE_EXAMPLES.tsx** 📖
**Purpose:** Example components showing how to use images

**Contains:**
- BusinessCard component (full example)
- BossCinematic component (boss images)
- FlexShopDisplay component (cosmetics)
- HustleCard component (hunts)
- Usage patterns for all asset types

**How to use:**
1. Reference when building components
2. Copy patterns you like
3. Always remember: `unoptimized={true}` for static export
4. Use `getImageByTier()` helper functions

---

### 8. **QUICK_ACTION_PLAN.md** ⚡
**Purpose:** Fast checklist to deploy TODAY

**Contains:**
- 4 phases (5 min each = 20 min total)
- Files to create/update
- Common issues & fixes
- What to test with friends

**How to use:**
1. Follow phases 1-4 in order
2. Takes ~20 minutes total
3. Reference troubleshooting if stuck
4. Share deployment URL with friends!

---

## 🎮 QUICK START (5 MINUTES)

```bash
# 1. Copy files to your project
# - next.config.js → project root
# - Onboarding.tsx → src/components/
# - assetMap.ts → src/lib/
# - .github/workflows/deploy.yml → .github/workflows/

# 2. Add GitHub Secrets
# Go to GitHub repo → Settings → Secrets and variables → Actions
# Add: NEXT_PUBLIC_SUPABASE_URL
# Add: NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Test locally
npm run build
npx serve out/

# 4. Push to GitHub
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main

# 5. Wait 2 minutes and visit:
# https://YOUR_USERNAME.github.io/grind-city/
```

---

## 🖼️ IMAGE IMPLEMENTATION TIMELINE

| Phase | What | Time |
|-------|------|------|
| **Now** | Deploy game (no images needed) | 20 min |
| **This week** | Create/find 145 images | 2-3 hours |
| **Next week** | Implement assetMap integration | 1 hour |
| **Later** | Optimize & add more cosmetics | ongoing |

**Note:** Game works fine with emoji icons until you add images!

---

## ✅ DEPLOYMENT CHECKLIST

Before pushing to GitHub:

- [ ] Updated `next.config.js` with correct repo name
- [ ] Copied `Onboarding.tsx` to `src/components/`
- [ ] Created `.github/workflows/deploy.yml`
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL` to GitHub Secrets
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY` to GitHub Secrets
- [ ] Ran `npm run build` locally - succeeded
- [ ] Tested with `npx serve out/` - game loads
- [ ] GitHub Pages source set to "GitHub Actions"
- [ ] Pushed to main branch
- [ ] Actions workflow completed (green ✅)
- [ ] Game loads at GitHub Pages URL
- [ ] Onboarding flow works
- [ ] Can create account and see dashboard

---

## 🚨 IF SOMETHING BREAKS

1. **Check GitHub Actions log:**
   - Go to repo → Actions tab
   - Click latest workflow
   - Scroll to error message

2. **Check browser console:**
   - Press F12
   - Go to Console tab
   - Look for red error messages

3. **Common fixes:**
   - Clear browser cache (Ctrl+Shift+Del)
   - Check environment variables
   - Verify `next.config.js` repo name is correct
   - Make sure `.github/workflows/deploy.yml` exists
   - Wait 2+ minutes after pushing

---

## 📞 TESTING WITH FRIENDS

Share this URL:
```
https://YOUR_USERNAME.github.io/grind-city/
```

Have them test:
1. ✅ Can they see onboarding?
2. ✅ Can they enter a username?
3. ✅ Does "Begin Grind" work?
4. ✅ Do they see dashboard?
5. ✅ Can they click HUSTLE?
6. ✅ Does energy deplete?

---

## 📝 NEXT DEVELOPMENT STEPS

After deployment works:

1. **Add Images**
   - Create/find 145 images
   - Place in `public/images/`
   - Update components to import from `assetMap`

2. **Test Features**
   - Mini-games (Big Bank, Dice, Shootout)
   - Boss fights
   - Prestige system
   - Crew functionality

3. **Optimize**
   - Lazy load images
   - Add sound effects (optional)
   - Mobile responsiveness
   - Leaderboards

4. **Polish**
   - Fix UI bugs
   - Add animations
   - Improve UX
   - Balance economy

---

## 🎯 YOUR MISSION

1. **Today:** Get deployed to GitHub Pages ✅
2. **This week:** Add images to game
3. **Next week:** Test with friends, collect feedback
4. **Ongoing:** Iterate and improve

---

## 📊 FILE REFERENCE

| File | Type | Purpose | Location |
|------|------|---------|----------|
| GRIND_CITY_IMAGE_ASSETS.md | Doc | Image spec | Reference |
| GITHUB_PAGES_DEPLOYMENT_GUIDE.md | Doc | Deployment | Follow step-by-step |
| next.config.js | Code | Config | Project root |
| .github/workflows/deploy.yml | Config | GitHub Actions | `.github/workflows/` |
| Onboarding.tsx | Component | Tutorial flow | `src/components/` |
| assetMap.ts | Utility | Image mapping | `src/lib/` |
| IMAGE_USAGE_EXAMPLES.tsx | Reference | How to use images | Reference only |
| QUICK_ACTION_PLAN.md | Doc | Fast checklist | Quick reference |

---

## 🚀 YOU'RE ALL SET!

Everything you need to:
- ✅ Get the game deployed
- ✅ Get it loading for friends
- ✅ Implement onboarding
- ✅ Organize all game assets
- ✅ Continue developing

**Start with QUICK_ACTION_PLAN.md and follow it step-by-step.**

Good luck! The grind starts now. 💪🎮