# Contributing - Factory Guest List

Terima kasih telah berkontribusi pada Factory Guest List! 🎉

Panduan ini akan membantu Anda memulai.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Git Workflow](#git-workflow)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Code of Conduct](#code-of-conduct)

---

## Quick Start

1. **Fork repository**
   ```bash
   # Klik Fork button di GitHub
   ```

2. **Clone repository**
   ```bash
   git clone https://github.com/<your-username>/factory-guest-list.git
   cd factory-guest-list
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Jalankan tests**
   ```bash
   npx vitest run
   ```

5. **Buka di browser**
   ```bash
   # Menggunakan Python
   python -m http.server 8000

   # Atau Node.js
   npx serve .
   ```

6. **Buka http://localhost:8000/login.html**

---

## Development Setup

### Prerequisites

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0
- **Git**
- **Browser** (Chrome/Firefox/Safari/Edge)

### IDE Setup

#### VS Code (Recommended)

Install extensions:
- **Live Server** - Auto reload
- **Prettier** - Code formatting
- **ESLint** - JavaScript linting
- **HTML CSS Support** - CSS autocomplete

Settings (`.vscode/settings.json`):
```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "emmet.includeLanguages": {
        "javascript": "javascriptreact"
    }
}
```

### Project Structure

```
factory-guest-list/
├── admin.html          # Admin dashboard
├── display.html        # Public display board
├── login.html          # Login page
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   └── app.js          # Application logic
├── img/
│   └── GGF.png         # Company logo
├── tests/
│   └── js/             # Unit tests
├── docs/               # Documentation
├── package.json        # Dependencies
└── vitest.config.js    # Test configuration
```

---

## Code Style

### JavaScript

#### General Rules

```javascript
// ✅ Good
const STORAGE_KEY = 'daftar_tamu_factory';

function getGuests() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}

// ❌ Bad
var storageKey = 'daftar_tamu_factory';

function getGuests() {
    var data = localStorage.getItem(storageKey);
    if (data == null) {
        return [];
    } else {
        try {
            var guests = JSON.parse(data);
            return guests;
        } catch (e) {
            return [];
        }
    }
}
```

#### Naming Conventions

```javascript
// Variables & Functions: camelCase
const guestData = {};
function getGuests() {}

// Constants: UPPER_SNAKE_CASE
const STORAGE_KEY = 'daftar_tamu_factory';

// Classes: PascalCase (if used)
class GuestManager {}

// Private functions: prefix with _
function _validateInput() {}
```

#### Formatting

```javascript
// 2 spaces indentation
function example() {
    const data = {
        key: 'value'
    };
}

// Semicolons required
const name = 'John';

// Single quotes for strings
const message = 'Hello';

// Template literals for interpolation
const greeting = `Hello, ${name}`;
```

### CSS

#### General Rules

```css
/* ✅ Good */
:root {
    --primary-color: #006B3F;
}

.status-badge {
    background-color: var(--primary-color);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
}

/* ❌ Bad */
.status-badge {
    background-color: #006B3F;
    color: white;
    padding: .25rem .5rem;
    border-radius: 4px;
}
```

#### Naming Conventions

```css
/* BEM naming */
.navbar { }
.navbar__logo { }
.navbar__menu { }
.navbar__item { }

/* States */
.navbar--active { }
.btn--disabled { }

/* Utilities */
.text-center { }
.mt-1 { }
```

### HTML

#### General Rules

```html
<!-- ✅ Good -->
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Daftar Tamu Factory</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="login-container">
        <h1>Login</h1>
        <form id="login-form">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
            </div>
        </form>
    </div>
    <script src="js/app.js"></script>
</body>
</html>

<!-- ❌ Bad -->
<html>
<head>
    <title>Login</title>
</head>
<body>
    <form>
        Username: <input type="text">
    </form>
</body>
</html>
```

---

## Git Workflow

### Branch Naming

```
feature/<feature-name>    # Fitur baru
fix/<bug-name>           # Bug fix
docs/<doc-name>          # Dokumentasi
refactor/<refactor-name> # Refactoring
```

**Examples:**
```bash
feature/add-export-csv
fix/login-redirect
docs/update-api
refactor/status-functions
```

### Commit Messages

Mengikuti [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**

| Type | Description | Example |
|------|-------------|---------|
| `feat` | Fitur baru | `feat(auth): add remember me` |
| `fix` | Bug fix | `fix(nav): fix mobile menu toggle` |
| `docs` | Dokumentasi | `docs: update README` |
| `style` | Format | `style: fix indentation` |
| `refactor` | Refactoring | `refactor: extract helper functions` |
| `test` | Tests | `test: add login tests` |
| `chore` | Maintenance | `chore: update dependencies` |

**Scopes:**

- `auth` - Authentication
- `nav` - Navigation
- `status` - Status flow
- `sort` - Sorting
- `datepicker` - Date picker
- `theme` - CSS/theme

**Examples:**
```bash
git commit -m "feat(auth): add logout confirmation"
git commit -m "fix(display): fix sort order"
git commit -m "docs: update deployment guide"
```

### Workflow

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes
# ... edit files ...

# 3. Run tests
npx vitest run

# 4. Commit changes
git add .
git commit -m "feat(scope): add my feature"

# 5. Push to your fork
git push origin feature/my-feature

# 6. Create Pull Request on GitHub
```

---

## Testing

### Running Tests

```bash
# Run all tests
npx vitest run

# Run specific test file
npx vitest run tests/js/status.test.js

# Run tests in watch mode
npx vitest

# Run tests with coverage
npx vitest run --coverage
```

### Writing Tests

#### Test Structure

```javascript
import { describe, it, expect } from 'vitest';

describe('Feature Name', () => {
    describe('specific behavior', () => {
        it('should do something when condition', () => {
            // Arrange
            const input = 'test';
            
            // Act
            const result = myFunction(input);
            
            // Assert
            expect(result).toBe('expected');
        });
    });
});
```

#### Test Naming Convention

```javascript
// Format: "should [expected behavior] when [condition]"
it('should return empty array when no guests exist', () => {
    // ...
});

it('should add guest when form is submitted', () => {
    // ...
});

it('should show error when login fails', () => {
    // ...
});
```

#### Mocking localStorage

```javascript
import { beforeEach, afterEach } from 'vitest';

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};

beforeEach(() => {
    global.localStorage = localStorageMock;
    vi.clearAllMocks();
});

afterEach(() => {
    vi.restoreAllMocks();
});

it('should save guest to localStorage', () => {
    // Arrange
    localStorageMock.getItem.mockReturnValue('[]');
    
    // Act
    addGuest({ nama: 'John' });
    
    // Assert
    expect(localStorageMock.setItem).toHaveBeenCalled();
});
```

### Test Coverage

Aim for:
- **Functions:** 80%+ coverage
- **Branches:** 70%+ coverage
- **Lines:** 80%+ coverage

---

## Pull Request Process

### Before Creating PR

- [ ] Tests pass (`npx vitest run`)
- [ ] Code follows style guidelines
- [ ] Documentation updated (if needed)
- [ ] No console.log statements
- [ ] No hardcoded values

### PR Template

```markdown
## Description

Brief description of changes.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] Manual testing done

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-reviewed
- [ ] Documentation updated
- [ ] No breaking changes
```

### PR Title

Follow commit convention:
```
feat(scope): add new feature
fix(scope): fix bug
docs(scope): update documentation
```

### Review Process

1. **Automated checks** must pass
2. **At least 1 review** required
3. **Resolve all comments**
4. **Squash and merge**

---

## Issue Guidelines

### Bug Report

```markdown
## Bug Description

A clear description of the bug.

## Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior

What you expected to happen.

## Actual Behavior

What actually happened.

## Screenshots

If applicable, add screenshots.

## Environment

- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]
```

### Feature Request

```markdown
## Feature Description

A clear description of the feature.

## Use Case

Why is this feature needed?

## Proposed Solution

How you think it should be implemented.

## Alternatives Considered

Other solutions you've considered.

## Additional Context

Any other information.
```

---

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Give and receive constructive feedback
- Focus on what is best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Publishing others' private information
- Other conduct which could be considered inappropriate

### Enforcement

Project maintainers have the right to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned with this Code of Conduct.

---

## Questions?

If you have questions:

1. Check existing documentation
2. Search existing issues
3. Create a new issue with label "question"

---

**Thank you for contributing!** 🙏
