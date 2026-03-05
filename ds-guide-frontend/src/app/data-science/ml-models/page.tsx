'use client';
import { useEffect } from 'react';

function renderMath() {
    if (typeof window === 'undefined') return;
    // @ts-ignore
    if (window.renderMathInElement) {
        // @ts-ignore
        window.renderMathInElement(document.body, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false }
            ],
            throwOnError: false
        });
    } else { setTimeout(renderMath, 100); }
}

export default function MLModelsPage() {
    useEffect(() => {
        // @ts-ignore
        if (window.hljs) window.hljs.highlightAll();
        renderMath();
    }, []);

    return (
        <>
            {/* ── HERO ── */}
            <div className="hero">
                <div className="hero-label">Study Guide</div>
                <h1>ML Models &amp; Training</h1>
                <p>Complete guide — from training theory and from-scratch implementations to sklearn pipelines, advanced ensemble models, and clustering.</p>
                <div className="badge-container">
                    <span className="badge badge-blue">Model Training</span>
                    <span className="badge badge-blue">Gradient Descent</span>
                    <span className="badge badge-green">Regularisation</span>
                    <span className="badge badge-green">Cross Validation</span>
                    <span className="badge badge-yellow">From Scratch</span>
                    <span className="badge badge-yellow">Sklearn Pipeline</span>
                    <span className="badge badge-gray">Clustering</span>
                </div>
            </div>

            {/* ═══════════════ PART 1 — THEORY ═══════════════ */}
            <h3 style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '0.5rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--color-border)' }}>Part 1 — Model Training Theory</h3>

            {/* WHY WE TRAIN */}
            <section className="card" id="why-train">
                <h2 className="card-title">Why We Train</h2>
                <p className="card-subtitle">"When I train an ML model, my goal is to find the optimal mathematical function that maps inputs X to outputs y automatically from the data, rather than trying to hand-code fragile business rules."</p>
                <ul>
                    <li>Model training = finding parameters <strong>θ</strong> such that <code>f(X) ≈ y</code></li>
                    <li>Parameters are learned by minimising a <strong>loss function</strong></li>
                    <li>The real goal is <strong>generalisation</strong> — performing well on unseen data</li>
                    <li>Model choice = choosing what shape of function to search over</li>
                </ul>
                <pre><code className="language-text">{`X (features) → [ Model θ ] → ŷ (prediction)
                                    ↕
                               y (truth)
                          → Loss = how wrong?
                          → Adjust θ, repeat`}</code></pre>
            </section>

            {/* BIAS-VARIANCE */}
            <section className="card" id="bias-variance">
                <h2 className="card-title">Bias-Variance Tradeoff</h2>
                <p className="card-subtitle">"I always keep the Bias-Variance tradeoff in mind because every model's error decomposes into these parts. It fundamentally drives my decisions on whether to collect more data, add regularization, or switch algorithms."</p>
                <div className="math-block">
                    {String.raw`$$\text{Total Error} = \text{Bias}^2 + \text{Variance} + \text{Irreducible Noise}$$`}
                </div>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Term</th><th>Meaning</th><th>Symptom</th><th>Called</th></tr></thead>
                        <tbody>
                            <tr><td>Bias</td><td>Model too simple</td><td>Bad on train AND test</td><td>Underfitting</td></tr>
                            <tr><td>Variance</td><td>Model too complex</td><td>Good on train, bad on test</td><td>Overfitting</td></tr>
                            <tr><td>Irreducible</td><td>Random noise in data</td><td>Cannot be removed</td><td>—</td></tr>
                        </tbody>
                    </table>
                </div>
                <div className="callout"><strong>Gotcha</strong><p>More data reduces variance but does NOT fix bias. If the model is structurally wrong, more data won't help.</p></div>
            </section>

            {/* LOSS FUNCTIONS */}
            <section className="card" id="loss-functions">
                <h2 className="card-title">Loss Functions</h2>
                <p className="card-subtitle">"To evaluate how badly my model is performing during training, I use a loss function. It converts the model's wrongness into a single differentiable scalar that I can then actively minimize."</p>
                <h3>Regression Losses</h3>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Loss</th><th>Formula</th><th>Use When</th></tr></thead>
                        <tbody>
                            <tr><td>MSE</td><td>{String.raw`$(1/n)\sum(y-\hat{y})^2$`}</td><td>Large errors truly bad; no outliers</td></tr>
                            <tr><td>MAE</td><td>{String.raw`$(1/n)\sum|y-\hat{y}|$`}</td><td>Outliers present</td></tr>
                            <tr><td>Huber</td><td>MSE small / MAE large</td><td>Robustness + smooth gradients</td></tr>
                        </tbody>
                    </table>
                </div>
                <h3>Classification Loss</h3>
                <div className="math-block">
                    {String.raw`$$L = -\frac{1}{n}\sum[y\log\hat{y} + (1-y)\log(1-\hat{y})]$$`}
                </div>
                <div className="callout"><strong>Gotcha</strong><p>Loss function vs Evaluation Metric — different things. Train with Log Loss but report Accuracy or F1 to stakeholders.</p></div>
            </section>

            {/* GRADIENT DESCENT */}
            <section className="card" id="gradient-descent">
                <h2 className="card-title">Gradient Descent</h2>
                <p className="card-subtitle">"To actually minimize the loss, I use Gradient Descent. It iteratively calculates the gradients of the loss with respect to my weights, gently nudging the network in the direction that reduces the overall error."</p>
                <div className="math-block">
                    {String.raw`$$\theta = \theta - \alpha \cdot \nabla L(\theta)$$`}
                </div>
                <p>θ = weights | α = learning rate | ∇L = gradient of loss</p>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Type</th><th>Data per Update</th><th>Used?</th></tr></thead>
                        <tbody>
                            <tr><td>Batch GD</td><td>Full dataset</td><td>Rarely</td></tr>
                            <tr><td>Stochastic GD</td><td>1 sample</td><td>Sometimes</td></tr>
                            <tr><td>Mini-Batch GD</td><td>32–256 samples</td><td>Standard</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* REGULARISATION */}
            <section className="card" id="regularisation">
                <h2 className="card-title">Regularisation — Fixing Overfitting</h2>
                <p className="card-subtitle">"Whenever my model starts overfitting the training data, I apply Regularization. By adding an L1 or L2 penalty term directly to my loss function, I force the model to stay simple and generalize better."</p>
                <div className="math-block">
                    {String.raw`$$\text{New Loss} = \text{Original Loss} + \lambda \cdot \text{Complexity Penalty}$$`}
                </div>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th></th><th>L2 — Ridge</th><th>L1 — Lasso</th><th>Elastic Net</th></tr></thead>
                        <tbody>
                            <tr><td>Penalty</td><td>{String.raw`$\lambda\sum\theta^2$`}</td><td>{String.raw`$\lambda\sum|\theta|$`}</td><td>Both combined</td></tr>
                            <tr><td>Effect</td><td>Weights small, never zero</td><td>Some weights exactly zero</td><td>Both effects</td></tr>
                            <tr><td>Feature selection</td><td>No</td><td>Yes — automatic</td><td>Yes</td></tr>
                            <tr><td>Use when</td><td>Many correlated features</td><td>Many irrelevant features</td><td>Unsure</td></tr>
                        </tbody>
                    </table>
                </div>
                <div className="callout"><strong>Gotcha</strong><p>Never regularise the bias term (θ₀). Only regularise feature weights.</p></div>
            </section>

            {/* TRAIN/VAL/TEST + CV */}
            <section className="card" id="splits-cv">
                <h2 className="card-title">Train / Val / Test + Cross-Validation</h2>
                <pre><code className="language-text">{`Full Dataset
├── Training Set   (60-70%)  → model learns from this
├── Validation Set (15-20%)  → tune hyperparameters
└── Test Set       (15-20%)  → FINAL evaluation — touched ONCE`}</code></pre>
                <pre><code className="language-python">{`from sklearn.model_selection import cross_val_score  # Import CV tool

cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='roc_auc')  # Run 5-fold CV to evaluate on sliced training data
print(f"Mean: {cv_scores.mean():.3f}  Std: {cv_scores.std():.3f}")  # Print the average and variance of the 5 scores`}</code></pre>
                <div className="callout"><strong>Golden Rule</strong><p>Touch the test set exactly once, at the very end. Tuning on test = data leakage.</p></div>
            </section>

            {/* DATA LEAKAGE */}
            <section className="card" id="data-leakage">
                <h2 className="card-title">Data Leakage — Pipeline is the Fix</h2>
                <p className="card-subtitle">"I'm extremely careful about Data Leakage. If any information from my test set accidentally influences the training preprocessing (like scaling before splitting), the model produces falsely optimistic, completely useless results."</p>
                <pre><code className="language-python">{`# ❌ WRONG — leakage
scaler.fit_transform(X)       # Calculates mean/var on the ENTIRE dataset, accidentally leaking test info into training

# ✅ CORRECT — no leakage
scaler.fit_transform(X_train) # Learn scaling parameters strictly from training data only
scaler.transform(X_test)      # Apply identically to test data without refitting

# ✅ BEST — Pipeline handles it automatically
from sklearn.pipeline import Pipeline  # A Pipeline enforces correct sequencing during CV and testing
pipe = Pipeline([                      # Define steps
    ('scaler', StandardScaler()),      # Step 1: Scale
    ('model',  LogisticRegression())   # Step 2: Predict
])
pipe.fit(X_train, y_train)             # Automatically fits scaler on train, scales train, then fits model
pipe.score(X_test, y_test)             # Automatically scales test data based on train stats, then predicts`}</code></pre>
            </section>

            {/* EVALUATION METRICS */}
            <section className="card" id="evaluation">
                <h2 className="card-title">Evaluation Metrics</h2>
                <h3>Classification</h3>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Metric</th><th>Formula</th><th>Use When</th></tr></thead>
                        <tbody>
                            <tr><td>Accuracy</td><td>(TP+TN) / All</td><td>Balanced classes</td></tr>
                            <tr><td>Precision</td><td>TP / (TP+FP)</td><td>FP costly (spam)</td></tr>
                            <tr><td>Recall</td><td>TP / (TP+FN)</td><td>FN costly (cancer)</td></tr>
                            <tr><td>F1</td><td>2×P×R / (P+R)</td><td>Imbalanced classes</td></tr>
                            <tr><td>AUC-ROC</td><td>Area under ROC</td><td>Compare models</td></tr>
                        </tbody>
                    </table>
                </div>
                <h3>Regression</h3>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Metric</th><th>Formula</th><th>Use When</th></tr></thead>
                        <tbody>
                            <tr><td>RMSE</td><td>{String.raw`$\sqrt{\text{mean}(y-\hat{y})^2}$`}</td><td>General purpose</td></tr>
                            <tr><td>MAE</td><td>{String.raw`$\text{mean}|y-\hat{y}|$`}</td><td>Outliers present</td></tr>
                            <tr><td>R²</td><td>{'$1 - SS_{res}/SS_{tot}$'}</td><td>Explain variance</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* HYPERPARAMETER TUNING */}
            <section className="card" id="hyperparameter">
                <h2 className="card-title">Hyperparameter Tuning</h2>
                <pre><code className="language-python">{`from sklearn.model_selection import RandomizedSearchCV  # Faster than GridSearch for large spaces
from scipy.stats import randint                         # Generates random integers for tuning

param_dist = {                                          # Note the 'model__' prefix targeting pipeline step
    'model__max_depth':    randint(3, 20),              # Randomly sample tree depth between 3 and 20
    'model__n_estimators': randint(50, 500),            # Randomly sample forest size between 50 and 500
}

search = RandomizedSearchCV(pipe, param_dist, n_iter=50, cv=5,  # Try 50 random combos, using 5-fold CV
                             scoring='roc_auc', n_jobs=-1, random_state=42) # n_jobs=-1 uses all CPU cores
search.fit(X_train, y_train)                            # Run the 250 total fits (50 * 5 folds)
print(search.best_params_)                              # Output the winning hyperparameters
print(search.best_score_)                               # Output the winning validation AUC`}</code></pre>
                <pre><code className="language-text">{`Tuning Workflow:
1. Train with defaults → baseline
2. RandomizedSearch → explore broadly
3. GridSearch in promising region → zoom in
4. Retrain best on ALL training data
5. Evaluate ONCE on test set`}</code></pre>
            </section>

            {/* ═══════════════ PART 2 — FROM SCRATCH + SKLEARN ═══════════════ */}
            <h3 style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '2rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--color-border)' }}>Part 2 — Models From Scratch + Sklearn</h3>

            {/* LINEAR REGRESSION */}
            <section className="card" id="scratch-linear">
                <h2 className="card-title">Linear Regression</h2>
                <p className="card-subtitle">"Whenever I have an early-stage regression problem, I start with Linear Regression. I find the weights that mathematically minimize the Mean Squared Error, prioritizing maximum interpretability for stakeholders."</p>
                <div className="badge-container">
                    <span className="badge badge-blue">Regression</span>
                    <span className="badge badge-green">Continuous target</span>
                </div>
                <div className="math-block">
                    {String.raw`$$\hat{y} = \theta_0 + \theta_1 x_1 + ... + \theta_p x_p \qquad \theta = (X^TX)^{-1}X^Ty$$`}
                </div>

                <div style={{ background: 'var(--color-bg-secondary)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Architecture Context</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, max-content) 1fr', gap: '0.5rem 1rem' }}>
                        <strong style={{ color: 'var(--color-text-muted)' }}>Predecessor:</strong>
                        <span>None (Foundational)</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Flaws of Predecessor:</strong>
                        <span>N/A</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>What it Solves:</strong>
                        <span>Predicting a continuous numerical value based on linear relationships between features and target.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Where to Use:</strong>
                        <span>Baseline regression tasks, when interpretability (feature coefficients) is the absolute highest priority.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Math Under Hood:</strong>
                        <span>{String.raw`$\hat{y} = \theta^T X$`} — computes a weighted sum of input features.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Loss Function:</strong>
                        <span>Mean Squared Error (MSE)</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Optimizer:</strong>
                        <span>Ordinary Least Squares (Closed-form Matrix Inversion) or Gradient Descent</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Output Format:</strong>
                        <span>Continuous unbounded scalar {String.raw`$\in (-\infty, \infty)$`}</span>
                    </div>
                </div>
                <h3>From Scratch</h3>
                <pre><code className="language-python">{`import numpy as np

class LinearRegressionScratch:
    def __init__(self, lr=0.01, n_iter=1000):               # Initialize with learning rate and epoch count
        self.lr, self.n_iter = lr, n_iter                   # Store hyperparameters
        self.theta_0 = self.theta_1 = None                  # Initialize intercept (theta_0) and slope (theta_1)
        self.loss_history = []                              # Store loss over time for debugging

    def fit(self, X, y):                                    # Train the model
        n = X.shape[0]                                      # Get number of samples
        self.theta_0 = self.theta_1 = 0.0                   # Start gradients at zero
        for _ in range(self.n_iter):                        # Iterate through epochs
            y_hat = self.theta_0 + self.theta_1 * X         # Compute current predictions (forward pass)
            errors = y - y_hat                              # Calculate raw errors
            self.loss_history.append((errors ** 2).mean())  # Save Mean Squared Error for this step
            self.theta_0 -= self.lr * (-2/n) * errors.sum()         # Update intercept using gradient w.r.t theta_0
            self.theta_1 -= self.lr * (-2/n) * (errors * X).sum()   # Update slope using gradient w.r.t theta_1

    def predict(self, X): return self.theta_0 + self.theta_1 * X    # Generate predictions for new X
    def score(self, X, y):                                          # Evaluate R^2 score
        y_hat = self.predict(X)                                     # Get predictions
        return 1 - ((y - y_hat)**2).sum() / ((y - y.mean())**2).sum() # Ratio of residual variance to total variance`}</code></pre>
                <h3>Sklearn End-to-End</h3>
                <pre><code className="language-python">{`from sklearn.linear_model import LinearRegression, Ridge, Lasso # Standard regression models
from sklearn.pipeline import Pipeline                       # For sequential execution
from sklearn.preprocessing import StandardScaler            # Standardize features globally
from sklearn.model_selection import train_test_split, cross_val_score # Evaluation tools
from sklearn.metrics import mean_squared_error, r2_score    # Scoring metrics
import numpy as np                                          # For math ops

# Split
X_train, X_test, y_train, y_test = train_test_split(        # Lock seed to 42 for reproducible train/test splits
    X, y, test_size=0.2, random_state=42)                   # Keep 20% completely untouched for final eval

# Pipeline (try Linear, Ridge, or Lasso)
pipe = Pipeline([                                           # Chain preprocessing and modeling to prevent data leakage
    ('scaler', StandardScaler()),                           # Z-score normalization for geometry-dependent models
    ('model',  Ridge(alpha=1.0))                            # Linear Regression with L2 penalty to prevent overfitting
])

# Cross-validate
cv = cross_val_score(pipe, X_train, y_train, cv=5,          # Run 5-fold cross-validation
                     scoring='neg_root_mean_squared_error') # Sklearn negates losses; we want to minimize RMSE
print(f"CV RMSE: {-cv.mean():.3f} ± {cv.std():.3f}")        # Re-invert to positive to intuitively print the score

# Train + evaluate
pipe.fit(X_train, y_train)                                  # Fit the full training set
y_pred = pipe.predict(X_test)                               # Feed the untouched test set mapping
print(f"Test RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.3f}")  # Root the MSE for absolute distance error
print(f"Test R²:   {r2_score(y_test, y_pred):.3f}")         # Explain the percentage of variance captured`}</code></pre>
            </section>

            {/* LOGISTIC REGRESSION */}
            <section className="card" id="scratch-logistic">
                <h2 className="card-title">Logistic Regression</h2>
                <p className="card-subtitle">"For my baseline classification tasks, I use Logistic Regression. By squashing a raw linear output through a Sigmoid activation, I get a strictly bounded, highly interpretable probability that minimizes Log Loss."</p>
                <div className="badge-container">
                    <span className="badge badge-blue">Classification</span>
                    <span className="badge badge-green">Binary / Multiclass</span>
                </div>
                <div className="math-block">
                    {String.raw`$$\hat{y} = \sigma(z) = \frac{1}{1+e^{-z}} \qquad \frac{\partial L}{\partial \theta_j} = \frac{1}{n}\sum(\hat{y}_i - y_i) \cdot x_{ij}$$`}
                </div>

                <div style={{ background: 'var(--color-bg-secondary)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Architecture Context</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, max-content) 1fr', gap: '0.5rem 1rem' }}>
                        <strong style={{ color: 'var(--color-text-muted)' }}>Predecessor:</strong>
                        <span>Linear Regression</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Flaws of Predecessor:</strong>
                        <span>Linear regression predicts unbounded values, which cannot be strictly interpreted as probabilities for classification. It is also overly sensitive to outliers when used for classification thresholds.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>What it Solves:</strong>
                        <span>Transforms the unbounded linear output into a strict bounded probability between 0 and 1.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Where to Use:</strong>
                        <span>Baseline binary classification and simple probability calibration.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Math Under Hood:</strong>
                        <span>{String.raw`$\hat{y} = \sigma(\theta^T X) = \frac{1}{1 + e^{-\theta^T X}}$`} — squashes linear combination through a Sigmoid (or Softmax) function.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Loss Function:</strong>
                        <span>Binary Cross-Entropy (Log-Loss)</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Optimizer:</strong>
                        <span>Gradient Descent or L-BFGS</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Output Format:</strong>
                        <span>Probability map {String.raw`$\in [0, 1]$`} per class</span>
                    </div>
                </div>
                <h3>From Scratch</h3>
                <pre><code className="language-python">{`class LogisticRegressionScratch:
    def __init__(self, lr=0.1, n_iter=1000):                # Default learning rate 0.1, 1k epochs
        self.lr, self.n_iter = lr, n_iter                   # Hydrate the object hyperparameters
        self.theta_0 = None; self.theta = None              # Bias and weights vector untouched
        self.loss_history = []                              # Track log-loss

    def _sigmoid(self, z): return 1 / (1 + np.exp(-z))      # Squash scalar or array continuously into (0, 1)

    def fit(self, X, y):                                    # Heavy lifting training
        n, p = X.shape                                      # Extract num_samples (n) and num_features (p)
        self.theta_0 = 0.0; self.theta = np.zeros(p)        # Initialise bias to 0 and weight vector to zeros
        for _ in range(self.n_iter):                        # Run Full-Batch Gradient Descent
            z = self.theta_0 + np.dot(X, self.theta)        # Linear combination: Intercept + Xw
            y_hat = self._sigmoid(z)                        # Pass through sigmoid to yield probability distribution
            loss = -(y * np.log(y_hat) + (1-y) * np.log(1-y_hat)).mean() # Compute Binary Cross-Entropy
            self.loss_history.append(loss)                  # Append for convergence tracking
            errors = y_hat - y                              # Derivative of log-loss with respect to z
            self.theta_0 -= self.lr * errors.mean()         # Adjust bias via average error
            self.theta   -= self.lr * np.dot(X.T, errors) / n # Matrix mult to update all feature weights simultaneously

    def predict_proba(self, X):                             # Return float confidence between 0.0 and 1.0
        return self._sigmoid(self.theta_0 + np.dot(X, self.theta))

    def predict(self, X, threshold=0.5):                    # Translate probability to strict discrete class label
        return (self.predict_proba(X) >= threshold).astype(int) # Boolean slice converted natively to 1 or 0

    def score(self, X, y):                                  # Evaluator method
        return (self.predict(X) == y).mean()                # Element-wise equality divided by dataset length = Accuracy`}</code></pre>
                <h3>Sklearn End-to-End</h3>
                <pre><code className="language-python">{`from sklearn.linear_model import LogisticRegression           # Highly optimized C-backend solver for Log Reg
from sklearn.pipeline import Pipeline                       # Abstract modeling wrapper
from sklearn.preprocessing import StandardScaler            # Prevent gradients from exploding if features vary in scale
from sklearn.model_selection import train_test_split, cross_val_score # Splitting + evaluation toolset
from sklearn.metrics import classification_report, roc_auc_score # Advanced class metrics

X_train, X_test, y_train, y_test = train_test_split(        # Create 80/20 train/test fractions
    X, y, test_size=0.2, random_state=42, stratify=y)       # stratify=y ensures target class ratios are equal in both splits

pipe = Pipeline([                                           # Guard against data leakage during cross-val
    ('scaler', StandardScaler()),                           # Ensure geometry is standard normal (Mu=0, Var=1)
    ('model',  LogisticRegression(C=1.0, max_iter=1000))    # C=1.0 is default inverse L2 penalty; max_iter prevents early timeout
])

cv = cross_val_score(pipe, X_train, y_train, cv=5, scoring='roc_auc') # Perform 5 separate training runs
print(f"CV AUC: {cv.mean():.3f} ± {cv.std():.3f}")          # Determine how stable the convergence is across folds

pipe.fit(X_train, y_train)                                  # Fully train pipeline on 100% of the training data
y_pred = pipe.predict(X_test)                               # Hard class assignments thresholded explicitly at 0.5
y_prob = pipe.predict_proba(X_test)[:, 1]                   # Grab raw sequence probabilities specifically for the positive class [1]
print(classification_report(y_test, y_pred))                # Summarize Precision, Recall, F1 into a dense matrix format
print(f"AUC: {roc_auc_score(y_test, y_prob):.3f}")          # Score the receiver operating curve over all possible thresholds`}</code></pre>
            </section>

            {/* KNN */}
            <section className="card" id="scratch-knn">
                <h2 className="card-title">K-Nearest Neighbours (KNN)</h2>
                <p className="card-subtitle">"When dealing with highly irregular but locally consistent decision boundaries, I might try KNN. Because it calculates Euclidean distances to take a majority vote, I absolutely must scale my features first, otherwise the largest scale dominates the distance."</p>
                <div className="badge-container">
                    <span className="badge badge-blue">Classification / Regression</span>
                    <span className="badge badge-green">Distance-based</span>
                </div>
                <div className="math-block">
                    {String.raw`$$d(a, b) = \sqrt{\sum_i (a_i - b_i)^2}$$`}
                </div>

                <div style={{ background: 'var(--color-bg-secondary)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Architecture Context</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, max-content) 1fr', gap: '0.5rem 1rem' }}>
                        <strong style={{ color: 'var(--color-text-muted)' }}>Predecessor:</strong>
                        <span>None (Instance-based learning)</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Flaws of Predecessor:</strong>
                        <span>N/A</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>What it Solves:</strong>
                        <span>Provides a non-parametric way to classify or regress without assuming any underlying mathematical distribution of the data.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Where to Use:</strong>
                        <span>Small datasets, recommendation systems, or when decision boundaries are highly irregular but locally consistent.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Math Under Hood:</strong>
                        <span>{String.raw`$d(p, q) = \sqrt{\sum(p_i - q_i)^2}$`} — calculates Euclidean (or Manhattan) distance to all points, picking the top K closest.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Loss Function:</strong>
                        <span>None (Lazy learner, no training required)</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Optimizer:</strong>
                        <span>None (Memorises the dataset)</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Output Format:</strong>
                        <span>Majority class vote (Classification) or mean of K nearest neighbors (Regression)</span>
                    </div>
                </div>
                <h3>From Scratch</h3>
                <pre><code className="language-python">{`class KNNScratch:
    def __init__(self, k=3):                                # Default to 3 neighbors to break ties
        self.k = k; self.X_train = self.y_train = None      # Just store hyperparameters, no weights to learn

    def fit(self, X, y):                                    # "Training" in KNN is instant
        self.X_train, self.y_train = X, y                   # KNN is a lazy learner; it just memorises the dataset

    def _predict_one(self, x):                              # Compute distance from a single test point to all train points
        dists = np.sqrt(((self.X_train - x) ** 2).sum(axis=1)) # Vectorized Euclidean distance calculation
        k_idx = dists.argsort()[:self.k]                    # Sort distances ascending, slice top K indices
        k_labels = self.y_train[k_idx]                      # Extract the target values for those top K closest points
        return 1 if (k_labels == 1).sum() > (k_labels == 0).sum() else 0 # Return majority class vote

    def predict(self, X):                                   # Loop over all testing instances
        return np.array([self._predict_one(X[i]) for i in range(len(X))]) # Assemble array of predictions

    def score(self, X, y): return (self.predict(X) == y).mean() # Basic accuracy (Percentage of exact matches)`}</code></pre>
                <h3>Sklearn End-to-End</h3>
                <pre><code className="language-python">{`from sklearn.neighbors import KNeighborsClassifier      # Optimized C-Tree/KD-Tree KNN solver
from sklearn.pipeline import Pipeline                   # Sequential model builder
from sklearn.preprocessing import StandardScaler        # Forces all numerical features onto the same geometric scale
from sklearn.model_selection import train_test_split, cross_val_score # Evaluation split wrappers
from sklearn.metrics import classification_report       # Detailed breakdown of performance

X_train, X_test, y_train, y_test = train_test_split(    # Partition data
    X, y, test_size=0.2, random_state=42, stratify=y)   # Stratify preserves class balance

# Scaling is CRITICAL for KNN — distances are meaningless without it
pipe = Pipeline([                                       # Prevent data leakage during splits
    ('scaler', StandardScaler()),                       # Shift mean to 0 and variance to 1. Without this, columns with larger numbers dominate Euclidean distance
    ('model',  KNeighborsClassifier(n_neighbors=5))     # Default K=5, usually odd to avoid ties
])

cv = cross_val_score(pipe, X_train, y_train, cv=5, scoring='accuracy') # Slice the training data 5 ways to test consistency
print(f"CV Accuracy: {cv.mean():.3f} ± {cv.std():.3f}") # Ensure the standard deviation is small (stable model)

pipe.fit(X_train, y_train)                              # Build the KD-Tree on all 80% train data
print(classification_report(y_test, pipe.predict(X_test))) # Print strict evaluation metrics for the reserved 20% test data`}</code></pre>
            </section>

            {/* DECISION TREE */}
            <section className="card" id="scratch-tree">
                <h2 className="card-title">Decision Tree</h2>
                <p className="card-subtitle">"To capture non-linear relationships without scaling, I rely on Decision Trees. I use an algorithm that recursively splits my data, always choosing the feature and threshold that strictly maximizes Information Gain."</p>
                <div className="badge-container">
                    <span className="badge badge-blue">Classification / Regression</span>
                    <span className="badge badge-green">Non-linear</span>
                </div>
                <div className="math-block">
                    {String.raw`$$H = -\sum p_i \log_2(p_i) \qquad IG = H(\text{parent}) - \frac{n_L}{n}H(\text{left}) - \frac{n_R}{n}H(\text{right})$$`}
                </div>

                <div style={{ background: 'var(--color-bg-secondary)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Architecture Context</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, max-content) 1fr', gap: '0.5rem 1rem' }}>
                        <strong style={{ color: 'var(--color-text-muted)' }}>Predecessor:</strong>
                        <span>Linear/Logistic Regression</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Flaws of Predecessor:</strong>
                        <span>Linear models strictly assume linear boundaries; they completely fail on XOR-like non-linear feature interactions without manual feature engineering.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>What it Solves:</strong>
                        <span>Automatically learns non-linear decision boundaries through hierarchical splitting of data space.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Where to Use:</strong>
                        <span>Interpretable non-linear mapping, mixed tabular data (categorical + numerical) without needing complex scaling.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Math Under Hood:</strong>
                        <span>Finds split that maximizes Information Gain: {String.raw`$IG = Entropy(Parent) - \sum \frac{N_i}{N} Entropy(Child_i)$`}</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Loss Function:</strong>
                        <span>Gini Impurity or Entropy (Classification), MSE / Variance Reduction (Regression)</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Optimizer:</strong>
                        <span>Greedy recursive splitting (CART or ID3 algorithm)</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Output Format:</strong>
                        <span>Terminal leaf node majority class / average</span>
                    </div>
                </div>
                <h3>From Scratch (Simplified)</h3>
                <pre><code className="language-python">{`class DecisionTreeScratch:
    def __init__(self, max_depth=3):                        # Stop tree from growing past depth 3 to avoid extreme overfitting
        self.max_depth = max_depth; self.tree = None        # Tree will be represented as a nested dictionary structure

    def _entropy(self, y):                                  # Calculate Shannon Entropy of an array of binary labels
        if len(y) == 0: return 0                            # Empty node implies total purity (0 entropy)
        p1 = (y == 1).mean()                                # Frequency (probability) of class 1
        if p1 == 0 or p1 == 1: return 0                     # If exclusively 1s or 0s, it's a completely pure node
        return -(p1 * np.log2(p1) + (1-p1) * np.log2(1-p1)) # -[p*log(p) + q*log(q)] evaluates disorder/chaos

    def _best_split(self, X, y):                            # Greedy loop finding the mathematically optimal place to slice
        best_ig, best_f, best_t = -1, None, None            # Tracks max Information Gain, best Feature index, best Threshold
        h_parent = self._entropy(y)                         # Parent disorder before any splitting
        for f in range(X.shape[1]):                         # Brute force through every single feature column
            for t in np.unique(X[:, f]):                    # Brute force through every unique value within that column
                left, right = y[X[:, f] <= t], y[X[:, f] > t] # Candidate slice: partition data into left and right buckets
                if len(left) == 0 or len(right) == 0: continue # Invalid split if one bucket ends up totally empty
                ig = h_parent - (len(left)/len(y))*self._entropy(left) \\
                     - (len(right)/len(y))*self._entropy(right) # Calculate how much entropy dropped compared to parent
                if ig > best_ig: best_ig, best_f, best_t = ig, f, t # If this drops entropy the most, update best variables
        return best_f, best_t, best_ig                      # Returns the optimal slice rule

    def _build(self, X, y, depth):                          # Recursive tree builder
        if self._entropy(y)==0 or depth>=self.max_depth or len(y)<2: # Check stopping criteria (pure node, max depth hit, or too small)
            return int(round(y.mean()))                     # Terminate into a leaf exactly here; return majority vote
        f, t, ig = self._best_split(X, y)                   # Perform the greedy slice search on current node
        if ig == 0: return int(round(y.mean()))             # Terminate if splitting doesn't help at all anymore
        left_m = X[:, f] <= t                               # Create boolean mask for the final decided optimal split
        return {'f': f, 't': t,                             # Return dictionary node containing split logic + branch deeper
                'L': self._build(X[left_m], y[left_m], depth+1),  # Recursively build left branch
                'R': self._build(X[~left_m], y[~left_m], depth+1)} # Recursively build right branch

    def fit(self, X, y): self.tree = self._build(X, y, 0)   # API entry point: kickstarts recursion at depth 0

    def _predict_one(self, x, node):                        # Recursive path traversal for a single row
        if not isinstance(node, dict): return node          # Base case: we struck a terminal leaf node (integer majority)
        return self._predict_one(x, node['L'] if x[node['f']]<=node['t'] else node['R']) # Compare threshold and route L/R

    def predict(self, X):                                   # API predict entry point
        return np.array([self._predict_one(X[i], self.tree) for i in range(len(X))]) # Traverse tree for every input row

    def score(self, X, y): return (self.predict(X) == y).mean() # Basic accuracy metric`}</code></pre>
                <h3>Sklearn End-to-End</h3>
                <pre><code className="language-python">{`from sklearn.tree import DecisionTreeClassifier           # Fast C-implemented CART algorithm
from sklearn.pipeline import Pipeline                       # Best practice modeling workflow
from sklearn.model_selection import train_test_split, cross_val_score # Performance verifiers
from sklearn.metrics import classification_report           # Prints precision, recall, f1-score

X_train, X_test, y_train, y_test = train_test_split(        # Common 80/20 data partition
    X, y, test_size=0.2, random_state=42, stratify=y)       # stratify=y ensures target class distribution holds

# No scaler needed — trees are scale-invariant
pipe = Pipeline([                                           # Because standard scaling does not disrupt sorting order, trees ignore it completely
    ('model', DecisionTreeClassifier(max_depth=5, min_samples_split=10, # Explicitly prune depth to prevent overfitting
                                      random_state=42))                 # Ensure feature tie-breaking is completely deterministic
])

cv = cross_val_score(pipe, X_train, y_train, cv=5, scoring='accuracy') # Slice 5 separate CV training folds
print(f"CV Accuracy: {cv.mean():.3f} ± {cv.std():.3f}")     # Gauge the variance of the tree's generalization

pipe.fit(X_train, y_train)                                  # Recursively partition the entire 80% dataset
print(classification_report(y_test, pipe.predict(X_test)))  # Run the untouched test sample down the tree structure`}</code></pre>
            </section>

            {/* NAIVE BAYES */}
            <section className="card" id="scratch-naive">
                <h2 className="card-title">Naive Bayes</h2>
                <p className="card-subtitle">"For high-dimensional baseline NLP tasks, I employ Naive Bayes. By assuming feature independence, I can completely skip gradient descent and just rely on direct statistical counting of priors and likelihoods to perform incredibly fast inference."</p>
                <div className="badge-container">
                    <span className="badge badge-blue">Classification</span>
                    <span className="badge badge-green">Probabilistic</span>
                </div>
                <div className="math-block">
                    {String.raw`$$P(\text{class}|\mathbf{x}) \propto P(\mathbf{x}|\text{class}) \times P(\text{class})$$`}
                </div>

                <div style={{ background: 'var(--color-bg-secondary)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Architecture Context</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, max-content) 1fr', gap: '0.5rem 1rem' }}>
                        <strong style={{ color: 'var(--color-text-muted)' }}>Predecessor:</strong>
                        <span>None (Probabilistic Generative)</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Flaws of Predecessor:</strong>
                        <span>N/A</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>What it Solves:</strong>
                        <span>Provides an extremely fast, highly scalable probability-based classifier by making the "naive" assumption that all features are independent given the class.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Where to Use:</strong>
                        <span>Text classification, spam filtering, baseline NLP tasks where feature independence is an acceptable assumption.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Math Under Hood:</strong>
                        <span>{String.raw`$P(y|X) \propto P(y) \prod P(x_i|y)$`} — applies Bayes Theorem using conditional probability distributions.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Loss Function:</strong>
                        <span>None explicitly minimized during training (Maximum Likelihood Estimation of parameters)</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Optimizer:</strong>
                        <span>Direct statistical computation (counting frequencies or calculating mean/variance)</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Output Format:</strong>
                        <span>Posterior probability distribution across classes</span>
                    </div>
                </div>
                <h3>From Scratch</h3>
                <pre><code className="language-python">{`class GaussianNBScratch:
    def __init__(self):                                     # No hyperparams needed at all!
        self.classes = None; self.priors = {}               # Dictionaries to store P(Class) probabilities
        self.means = {}; self.vars = {}                     # Dictionaries to store P(x|Class) Gaussian parameters

    def fit(self, X, y):                                    # Does not use gradient descent. Pure statistical counting.
        self.classes = np.unique(y)                         # Identify distinct target groups
        for c in self.classes:                              # Treat each class in complete isolation
            Xc = X[y == c]                                  # Subset data to just this specific class group
            self.priors[c] = len(Xc) / len(X)               # Calculate Prior probability: P(Class)
            self.means[c] = Xc.mean(axis=0)                 # Capture the exact numerical center point of this class
            self.vars[c] = Xc.var(axis=0) + 1e-9            # Capture variance, adding a tiny epsilon so division by zero never occurs

    def _log_posterior(self, x, c):                         # Uses logs to prevent underflow from multiplying tiny floating probabilities
        log_prior = np.log(self.priors[c])                  # Convert prior into log-space
        log_lik = -0.5 * np.sum(np.log(2*np.pi*self.vars[c])# Applies logarithmic Gaussian Probability Density Function
                    + (x - self.means[c])**2 / self.vars[c])# Normalizes distance against class variance
        return log_prior + log_lik                          # Sum of logs perfectly equivalent to Product of raw probabilities

    def predict(self, X):                                   # Fast inference method
        return np.array([                                   # Compare log posterior for all possible classes
            max(self.classes, key=lambda c: self._log_posterior(X[i], c)) # Always explicitly vote for highest probability
            for i in range(len(X))])

    def score(self, X, y): return (self.predict(X) == y).mean() # Basic accuracy count`}</code></pre>
                <h3>Sklearn End-to-End</h3>
                <pre><code className="language-python">{`from sklearn.naive_bayes import GaussianNB                  # Scalable probability classifier
from sklearn.pipeline import Pipeline                       # Safely orchestrate scaling before prediction
from sklearn.preprocessing import StandardScaler            # Centers variable distributions for clearer Gaussian modeling
from sklearn.model_selection import train_test_split, cross_val_score # Robust evaluation splitting tools
from sklearn.metrics import classification_report           # Performance matrix summarizer

X_train, X_test, y_train, y_test = train_test_split(        # Lock the split for valid cross-model comparisons
    X, y, test_size=0.2, random_state=42, stratify=y)       # Distribute minority labels equally

pipe = Pipeline([                                           # Bundle data cleaning logic
    ('scaler', StandardScaler()),                           # Normalization isn't strictly necessary for Naive Bayes prediction mapping, but heavily aids numerical stability
    ('model',  GaussianNB())                                # Pure Bayesian likelihood counting under the hood
])

cv = cross_val_score(pipe, X_train, y_train, cv=5, scoring='accuracy') # Rapidly assess class separation 5 times
print(f"CV Accuracy: {cv.mean():.3f} ± {cv.std():.3f}")     # Evaluate how reliably Bayes splits the space

pipe.fit(X_train, y_train)                                  # Computes all global means and variances instantly
print(classification_report(y_test, pipe.predict(X_test)))  # Run inference using Bayes theorem limits`}</code></pre>
            </section>

            {/* ═══════════════ PART 3 — ADVANCED MODELS ═══════════════ */}
            <h3 style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '2rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--color-border)' }}>Part 3 — Advanced Models with Pipeline</h3>

            {/* RANDOM FOREST */}
            <section className="card" id="random-forest">
                <h2 className="card-title">Random Forest</h2>
                <p className="card-subtitle">"Because single Decision Trees suffer from massive variance, I upgrade to a Random Forest ensemble. By bootstrapping subsets of data and randomly selecting features per split, I mathematically force the trees to be decorrelated, drastically improving generalization through bagging."</p>
                <div className="badge-container">
                    <span className="badge badge-blue">Classification / Regression</span>
                    <span className="badge badge-green">Ensemble — Bagging</span>
                </div>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Hyperparameter</th><th>What it does</th><th>Typical range</th></tr></thead>
                        <tbody>
                            <tr><td>n_estimators</td><td>Number of trees</td><td>100–500</td></tr>
                            <tr><td>max_depth</td><td>Max tree depth</td><td>5–20 or None</td></tr>
                            <tr><td>min_samples_split</td><td>Min samples to split</td><td>2–20</td></tr>
                            <tr><td>max_features</td><td>Features per split</td><td>'sqrt' or 'log2'</td></tr>
                        </tbody>
                    </table>
                </div>

                <div style={{ background: 'var(--color-bg-secondary)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Architecture Context</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, max-content) 1fr', gap: '0.5rem 1rem' }}>
                        <strong style={{ color: 'var(--color-text-muted)' }}>Predecessor:</strong>
                        <span>Decision Trees</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Flaws of Predecessor:</strong>
                        <span>Single decision trees have extremely high variance; they notoriously overfit the training data and memorize noise.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>What it Solves:</strong>
                        <span>Drastically reduces variance without increasing bias through "Bagging" (Bootstrap Aggregating) — training many decorrelated trees and averaging them.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Where to Use:</strong>
                        <span>Excellent "first-try" model for any tabular dataset. Highly robust to outliers, missing data, and requires almost zero hyperparameter tuning.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Math Under Hood:</strong>
                        <span>{String.raw`$\hat{y} = \frac{1}{B} \sum_{b=1}^{B} f_b(X)$`} — predicts the average or majority vote of $B$ independent trees trained on bootstrap samples and random feature subsets.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Loss Function:</strong>
                        <span>Gini / Entropy (per constituent tree)</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Optimizer:</strong>
                        <span>Greedy splitting on random subsets</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Output Format:</strong>
                        <span>Aggregated probability / mean scalar</span>
                    </div>
                </div>
                <pre><code className="language-python">{`from sklearn.ensemble import RandomForestClassifier         # Uses bootstrap aggregating (bagging) over many trees
from sklearn.pipeline import Pipeline                       # Abstract modeling sequences
from sklearn.model_selection import train_test_split, cross_val_score, RandomizedSearchCV # Model tuning utilities
from sklearn.metrics import classification_report, roc_auc_score # Performance verifiers
from scipy.stats import randint                             # To randomly sample integers for grid searching

X_train, X_test, y_train, y_test = train_test_split(        # Common 80/20 test split
    X, y, test_size=0.2, random_state=42, stratify=y)       # Stratification protects against wildly imbalanced target classes

# No scaler needed — trees are scale-invariant
pipe = Pipeline([                                           # Trees simply partition based on boolean splits (X < 5)
    ('model', RandomForestClassifier(random_state=42))      # Create deterministic ensemble
])

# Quick baseline
cv = cross_val_score(pipe, X_train, y_train, cv=5, scoring='roc_auc') # Baseline score without hyperparams
print(f"Baseline CV AUC: {cv.mean():.3f} ± {cv.std():.3f}") # Print mean and deviation of baseline ensemble

# Tune
param_dist = {                                              # Define the permutation search space
    'model__n_estimators':     randint(100, 500),           # How many subset trees to build
    'model__max_depth':        randint(3, 20),              # Deep trees memorize, shallow trees generalize
    'model__min_samples_split': randint(2, 20),             # Stop splitting if a node drops below this data size limit
    'model__max_features':     ['sqrt', 'log2'],            # Critically forces trees to look at random distinct columns
}
search = RandomizedSearchCV(pipe, param_dist, n_iter=50, cv=5, # Iteratively explore 50 combos instead of wasting compute on ALL
                             scoring='roc_auc', n_jobs=-1, random_state=42) # Automatically evaluate via CV using parallel workers
search.fit(X_train, y_train)                                # Run the grueling hyperparameter optimization sweep
print(f"Best AUC: {search.best_score_:.3f}")                # Display the ultimate highest CV score
print(f"Best params: {search.best_params_}")                # Display what dictionary parameters won

# Final evaluation
y_pred = search.predict(X_test)                             # Predict 1 or 0 binary outcomes on untouched test dataset
y_prob = search.predict_proba(X_test)[:, 1]                 # Retrieve continuous probability floats
print(classification_report(y_test, y_pred))                # Summarize precision, recall, f1
print(f"Test AUC: {roc_auc_score(y_test, y_prob):.3f}")     # Ensure Test AUC closely matches best CV AUC without dropping heavily`}</code></pre>
            </section>

            {/* XGBOOST */}
            <section className="card" id="xgboost">
                <h2 className="card-title">XGBoost</h2>
                <p className="card-subtitle">"When I need maximum performance on structured tabular data, I default to XGBoost. By sequentially building trees where each tree is literally trained to predict the negative gradient (residual) of the previous ensemble, I can push accuracy to state-of-the-art limits."</p>
                <div className="badge-container">
                    <span className="badge badge-blue">Classification / Regression</span>
                    <span className="badge badge-green">Ensemble — Boosting</span>
                    <span className="badge badge-yellow">Best for tabular data</span>
                </div>

                <div style={{ background: 'var(--color-bg-secondary)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Architecture Context</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, max-content) 1fr', gap: '0.5rem 1rem' }}>
                        <strong style={{ color: 'var(--color-text-muted)' }}>Predecessor:</strong>
                        <span>Gradient Boosting Machines (GBM)</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Flaws of Predecessor:</strong>
                        <span>Standard GBMs are sequentially slow to train, prone to overfitting if unchecked, and lack built-in handling for sparse data.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>What it Solves:</strong>
                        <span>Adds hardware optimizations, second-order (Hessian) gradients, default L1/L2 regularization, and sparsity-aware splitting to create the ultimate state-of-the-art tree model.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Where to Use:</strong>
                        <span>Tabular data competitions, high-performance production systems containing structured data.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Math Under Hood:</strong>
                        <span>Optimizes a regularized objective: {String.raw`$Obj = \sum L(y_i, \hat{y}_i) + \sum \Omega(f_k)$`} using Taylor expansion approximation for gradients.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Loss Function:</strong>
                        <span>Customizable (Log-Loss, MSE, etc.) + {String.raw`$L1/L2$`} penalty</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Optimizer:</strong>
                        <span>Second-order Gradient Descent (Newton-Raphson step equivalent in tree space)</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Output Format:</strong>
                        <span>Sum of raw leaf scores, passed through Sigmoid/Softmax</span>
                    </div>
                </div>
                <pre><code className="language-python">{`from xgboost import XGBClassifier                         # The ultimate state-of-the-art tree-boosting algorithm
from sklearn.pipeline import Pipeline                       # Abstract modeling wrapper
from sklearn.model_selection import train_test_split, cross_val_score, RandomizedSearchCV # Evaluators
from sklearn.metrics import classification_report, roc_auc_score # Scorers
from scipy.stats import uniform, randint                    # Allows sampling integers and floats

X_train, X_test, y_train, y_test = train_test_split(        # Generate training slice
    X, y, test_size=0.2, random_state=42, stratify=y)       # Distribute categories uniformly

pipe = Pipeline([                                           # Again, trees do not require scaling pipelines
    ('model', XGBClassifier(eval_metric='logloss', random_state=42, # Suppress XGBoost deprecation warnings automatically
                             use_label_encoder=False))      # Use raw numeric representations under the hood
])

# Baseline
cv = cross_val_score(pipe, X_train, y_train, cv=5, scoring='roc_auc') # Grab default naive performance
print(f"Baseline CV AUC: {cv.mean():.3f} ± {cv.std():.3f}") # Print starting benchmark

# Tune
param_dist = {                                              # Defines hyperparameter permutations
    'model__n_estimators':     randint(100, 500),           # Sequential trees to build
    'model__max_depth':        randint(3, 10),              # Maximum hierarchy depth allowed per tree
    'model__learning_rate':    uniform(0.01, 0.3),          # How heavily the algorithm listens to each tree's attempt to fix residuals
    'model__subsample':        uniform(0.6, 0.4),           # Select row fractions via bagging to dodge overfitting
    'model__colsample_bytree': uniform(0.6, 0.4),           # Hide columns randomly every time (column bagging)
    'model__min_child_weight': randint(1, 10),              # Hard-stopper representing L2 regularization on leaf scores
}
search = RandomizedSearchCV(pipe, param_dist, n_iter=50, cv=5, # Exhaustively search through randomly plotted hyperparams
                             scoring='roc_auc', n_jobs=-1, random_state=42) # Automatically execute on parallel workers
search.fit(X_train, y_train)                                # Commit cross validation runs
print(f"Best AUC: {search.best_score_:.3f}")                # Confirm improvement from tuned dictionary

y_pred = search.predict(X_test)                             # Extract binary results from holdout
y_prob = search.predict_proba(X_test)[:, 1]                 # Extract confidence scores
print(classification_report(y_test, y_pred))                # Summarize standard stats
print(f"Test AUC: {roc_auc_score(y_test, y_prob):.3f}")     # Gauge total geometric probability curve`}</code></pre>
            </section>

            {/* GRADIENT BOOSTING */}
            <section className="card" id="gradient-boosting">
                <h2 className="card-title">Gradient Boosting &amp; AdaBoost</h2>
                <p className="card-subtitle">"If I can't install XGBoost or need to stay strictly within the scikit-learn ecosystem, I leverage its built-in GradientBoostingClassifier. Like XGBoost, I fit new trees directly to the residuals, slowly reducing the bias of the overall ensemble."</p>
                <div className="badge-container">
                    <span className="badge badge-blue">Classification / Regression</span>
                    <span className="badge badge-green">Ensemble — Boosting</span>
                </div>

                <div style={{ background: 'var(--color-bg-secondary)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Architecture Context</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, max-content) 1fr', gap: '0.5rem 1rem' }}>
                        <strong style={{ color: 'var(--color-text-muted)' }}>Predecessor:</strong>
                        <span>Decision Trees / Random Forests</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Flaws of Predecessor:</strong>
                        <span>Random Forests reduce variance but cannot reduce bias. If the constituent trees underfit, the forest underfits.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>What it Solves:</strong>
                        <span>Reduces bias by building trees sequentially ("Boosting"), where each new tree specifically focuses on correcting the errors (residuals) of the combined previous ensemble.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Where to Use:</strong>
                        <span>High-performance tabular regression and classification where hyperparameter tuning time is available.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Math Under Hood:</strong>
                        <span>{String.raw`$F_m(x) = F_{m-1}(x) + \gamma_m h_m(x)$`} — the new tree $h_m$ fits exactly to the negative gradient of the loss with respect to the previous prediction.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Loss Function:</strong>
                        <span>Deviance / Cross-Entropy / MSE</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Optimizer:</strong>
                        <span>Gradient Descent in function space (fitting trees to residuals)</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Output Format:</strong>
                        <span>Aggregated sum scaled by a learning rate</span>
                    </div>
                </div>
                <h3>GradientBoostingClassifier</h3>
                <pre><code className="language-python">{`from sklearn.ensemble import GradientBoostingClassifier # Sklearn native boosting solver
from sklearn.pipeline import Pipeline                       # Abstraction chain
from sklearn.model_selection import train_test_split, cross_val_score # Cross-validators
from sklearn.metrics import classification_report, roc_auc_score # Diagnostic modules

X_train, X_test, y_train, y_test = train_test_split(        # Lock identical sets across all 3 ensemble notebooks
    X, y, test_size=0.2, random_state=42, stratify=y)       # Distribute test samples uniformly

pipe = Pipeline([                                           # Initialize pipeline wrapper
    ('model', GradientBoostingClassifier(                   # Build native boosting sequence
        n_estimators=200, max_depth=5, learning_rate=0.1,   # 200 sequential estimators with depth 5 correcting errors at 0.1 delta
        subsample=0.8, random_state=42))                    # Discard 20% of data randomly per step (Stochastic Boosting regularization)
])

cv = cross_val_score(pipe, X_train, y_train, cv=5, scoring='roc_auc') # Average metric stability checking
print(f"CV AUC: {cv.mean():.3f} ± {cv.std():.3f}")          # Print accuracy results

pipe.fit(X_train, y_train)                                  # Kick off sequential training loop
y_prob = pipe.predict_proba(X_test)[:, 1]                   # Grab 0 to 1 scaling prediction output
print(classification_report(y_test, pipe.predict(X_test)))  # Format classification dictionary into terminal
print(f"Test AUC: {roc_auc_score(y_test, y_prob):.3f}")     # Reveal final accuracy`}</code></pre>
                <h3>AdaBoostClassifier</h3>
                <pre><code className="language-python">{`from sklearn.ensemble import AdaBoostClassifier             # Early generation boosting technique
from sklearn.tree import DecisionTreeClassifier             # Explicit stump definitions

pipe = Pipeline([                                           # Create isolated modeling box
    ('model', AdaBoostClassifier(                           # Build sequential reweighting setup
        estimator=DecisionTreeClassifier(max_depth=1),      # AdaBoost specifically relies strictly on 1-depth 'stumps' instead of deep trees
        n_estimators=200, learning_rate=0.1, random_state=42)) # Instead of looking at residuals, it explicitly heavily penalizes misclassified rows
])

cv = cross_val_score(pipe, X_train, y_train, cv=5, scoring='roc_auc') # Cross validate stumps against data slices
print(f"CV AUC: {cv.mean():.3f} ± {cv.std():.3f}")          # Check average variance

pipe.fit(X_train, y_train)                                  # Progress sequentially reweighting target values through stumps
print(classification_report(y_test, pipe.predict(X_test)))  # Run metrics inference calculation`}</code></pre>
            </section>

            {/* SVM */}
            <section className="card" id="svm">
                <h2 className="card-title">Support Vector Machine (SVM)</h2>
                <p className="card-subtitle">"When I need strict classification boundaries on smaller, complex datasets, I use an SVM. Instead of just picking any line that separates data, I mathematically solve for the hyperplane that maximizes the geometric margin between classes."</p>
                <div className="badge-container">
                    <span className="badge badge-blue">Classification / Regression</span>
                    <span className="badge badge-green">Max-margin</span>
                </div>

                <div style={{ background: 'var(--color-bg-secondary)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Architecture Context</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, max-content) 1fr', gap: '0.5rem 1rem' }}>
                        <strong style={{ color: 'var(--color-text-muted)' }}>Predecessor:</strong>
                        <span>Logistic Regression</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Flaws of Predecessor:</strong>
                        <span>Logistic regression fundamentally draws a linear boundary and does so by minimizing point-wise log loss, without strictly caring about maximizing the "safety buffer" (margin) between classes.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>What it Solves:</strong>
                        <span>Finds the optimal hyperplane that strictly maximizes the margin separating classes. Via the "Kernel Trick", it can project data into infinite-dimensional space to easily separate highly complex non-linear patterns.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Where to Use:</strong>
                        <span>Strict margin separation, smaller datasets with highly complex/non-linear boundaries (using RBF kernel).</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Math Under Hood:</strong>
                        <span>Optimizes {String.raw`$\max \frac{2}{||w||}$`} subject to {String.raw`$y_i(w^T x_i + b) \geq 1$`} using Lagrange multipliers.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Loss Function:</strong>
                        <span>Hinge Loss + L2 Regularization penalty</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Optimizer:</strong>
                        <span>Sequential Minimal Optimization (SMO) / Quadratic Programming solver</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Output Format:</strong>
                        <span>Distance from the separating hyperplane {String.raw`$\in (-\infty, \infty)$`} (pluggable into Platt scaling for probability)</span>
                    </div>
                </div>
                <pre><code className="language-python">{`from sklearn.svm import SVC                             # The classic Support Vector Classifier
from sklearn.pipeline import Pipeline                       # Abstract component sequential chaining 
from sklearn.preprocessing import StandardScaler            # Extremely needed since SVM draws hyperplanes purely geometrically
from sklearn.model_selection import train_test_split, cross_val_score # Slicer modules
from sklearn.metrics import classification_report           # Evaluation module

X_train, X_test, y_train, y_test = train_test_split(        # Partition test data
    X, y, test_size=0.2, random_state=42, stratify=y)       # Distribute minority labels equally

# Scaling is CRITICAL for SVM
pipe = Pipeline([                                           # Build the modeling chain
    ('scaler', StandardScaler()),                           # Transform coordinates to mean 0 variance 1 so Euclidean distances make sense
    ('model',  SVC(kernel='rbf', C=1.0, gamma='scale', probability=True)) # RBF Kernel dynamically projects into infinite dimensions for nonlinear slices; C is margin hardness; prob=True runs costly Platt Scaling for AUC
])

cv = cross_val_score(pipe, X_train, y_train, cv=5, scoring='roc_auc') # Average metric stability
print(f"CV AUC: {cv.mean():.3f} ± {cv.std():.3f}")          # Reveal performance spread

pipe.fit(X_train, y_train)                                  # Kick off complex quadratic programming optimization
print(classification_report(y_test, pipe.predict(X_test)))  # Run metrics inference calculation`}</code></pre>
                <div className="callout"><strong>Gotcha</strong><p>SVM is slow on large datasets (&gt;10k samples). Use LinearSVC for large data or consider tree-based models instead.</p></div>
            </section>

            {/* ═══════════════ PART 4 — CLUSTERING ═══════════════ */}
            <h3 style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '2rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--color-border)' }}>Part 4 — Clustering (Unsupervised)</h3>

            {/* K-MEANS */}
            <section className="card" id="kmeans">
                <h2 className="card-title">K-Means Clustering</h2>
                <p className="card-subtitle">"For baseline customer segmentation, I usually start with K-Means. I assign points to the nearest centroid, update the centroids via the mean, and iterate. However, its primary drawback is that I have to guess the number of clusters (K) in advance using the elbow method."</p>
                <div className="badge-container">
                    <span className="badge badge-blue">Unsupervised</span>
                    <span className="badge badge-green">Centroid-based</span>
                </div>

                <div style={{ background: 'var(--color-bg-secondary)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Architecture Context</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, max-content) 1fr', gap: '0.5rem 1rem' }}>
                        <strong style={{ color: 'var(--color-text-muted)' }}>Predecessor:</strong>
                        <span>None (Partition-based clustering)</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Flaws of Predecessor:</strong>
                        <span>N/A</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>What it Solves:</strong>
                        <span>Automatically groups unlabeled data into K distinct non-overlapping clusters based on inherent feature similarities.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Where to Use:</strong>
                        <span>Customer segmentation, rapid profiling, when clusters are assumed to be roughly spherical and equally sized.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Math Under Hood:</strong>
                        <span>Minimizes Within-Cluster Sum of Squares (WCSS): {String.raw`$\sum_{i=1}^k \sum_{x \in C_i} ||x - \mu_i||^2$`}</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Loss Function:</strong>
                        <span>Inertia (Sum of squared distances to centroid)</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Optimizer:</strong>
                        <span>Lloyd's Algorithm (Expectation-Maximization alternating between assignment and centroid update)</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Output Format:</strong>
                        <span>Distinct integer cluster label {String.raw`$\in [0, K-1]$`}</span>
                    </div>
                </div>
                <h3>Algorithm</h3>
                <pre><code className="language-text">{`1. Choose K (number of clusters)
2. Randomly initialise K centroids
3. Assign each point to nearest centroid
4. Recompute centroids as mean of assigned points
5. Repeat 3-4 until centroids stop moving`}</code></pre>
                <h3>Sklearn + Elbow Method</h3>
                <pre><code className="language-python">{`from sklearn.cluster import KMeans                      # Centroid based clustering algorithm
from sklearn.preprocessing import StandardScaler            # Extremely needed as clustering is entirely distance-based
from sklearn.metrics import silhouette_score                # Mathematically evaluates cluster cohesion and separation
import matplotlib.pyplot as plt                             # Visualizer

# Always scale before clustering
scaler = StandardScaler()                                   # Create data z-score standardizer
X_scaled = scaler.fit_transform(X)                          # Automatically forces data onto a completely uniform geometric distribution

# Elbow method — find optimal K
inertias = []                                               # Container for Within-Cluster Sum of Squares (Inertia)
sil_scores = []                                             # Container for density overlap
K_range = range(2, 11)                                      # Run simulations across K from 2 through 10 logically

for k in K_range:                                           # Sweep through the hyperparameter K visually
    km = KMeans(n_clusters=k, random_state=42, n_init=10)   # Test cluster assignment; n_init tries 10 random starting locations
    km.fit(X_scaled)                                        # Execute the Expectation-Maximization Lloyd loop
    inertias.append(km.inertia_)                            # Save internal squared distance to centroids
    sil_scores.append(silhouette_score(X_scaled, km.labels_)) # Calculate how well separated the discovered clusters actually are

# Plot elbow
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))      # Initialize visual comparison board
ax1.plot(K_range, inertias, 'bo-'); ax1.set_title('Elbow (Inertia)') # Look for the "elbow point" where curve flattens noticeably
ax2.plot(K_range, sil_scores, 'ro-'); ax2.set_title('Silhouette Score') # Typically choose the K maximizing Silhouette natively
plt.show()                                                  # Commit graphics to notebook rendering

# Final model with best K
best_k = 3  # chosen from elbow
km = KMeans(n_clusters=best_k, random_state=42, n_init=10)  # Instantiate exact best optimal parameter found
labels = km.fit_predict(X_scaled)                           # Derive actual row to group assignments iteratively
print(f"Silhouette: {silhouette_score(X_scaled, labels):.3f}") # Print total density separation quality metric`}</code></pre>
                <div className="callout"><strong>Gotcha</strong><p>K-Means assumes spherical, equal-sized clusters. Fails on elongated or irregular shapes — use DBSCAN instead.</p></div>
            </section>

            {/* DBSCAN */}
            <section className="card" id="dbscan">
                <h2 className="card-title">DBSCAN</h2>
                <p className="card-subtitle">"When my clusters are strangely shaped or I don't know how many clusters exist, K-Means fails completely. Instead, I use DBSCAN, which groups points using local density and beautifully isolates true anomalies as 'noise' rather than forcing them into a cluster."</p>
                <div className="badge-container">
                    <span className="badge badge-blue">Unsupervised</span>
                    <span className="badge badge-green">Density-based</span>
                    <span className="badge badge-yellow">Handles outliers</span>
                </div>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Parameter</th><th>What it does</th></tr></thead>
                        <tbody>
                            <tr><td>eps</td><td>Max distance between two points in same neighbourhood</td></tr>
                            <tr><td>min_samples</td><td>Min points to form a dense region (core point)</td></tr>
                        </tbody>
                    </table>
                </div>

                <div style={{ background: 'var(--color-bg-secondary)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Architecture Context</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, max-content) 1fr', gap: '0.5rem 1rem' }}>
                        <strong style={{ color: 'var(--color-text-muted)' }}>Predecessor:</strong>
                        <span>K-Means</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Flaws of Predecessor:</strong>
                        <span>K-Means requires guessing K in advance, utterly fails on non-spherical (e.g., elongated or nested) clusters, and is heavily skewed by outliers since it aggressively forces every point into a cluster.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>What it Solves:</strong>
                        <span>Uses local density to define clusters. Does not need K, beautifully handles arbitrary shapes, and automatically isolates outliers as "noise" instead of breaking the clusters.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Where to Use:</strong>
                        <span>Geospatial mapping, anomaly detection, when cluster count is unknown or shapes are highly irregular.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Math Under Hood:</strong>
                        <span>Core point definition: Must have $\geq$ `min_samples` within a radius `eps` {String.raw`$N_{\epsilon}(p)$`}. Connects overlapping core points.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Loss Function:</strong>
                        <span>None (Rule-based region growing)</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Optimizer:</strong>
                        <span>Graph traversal / Breadth-First Search on density reachability network</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Output Format:</strong>
                        <span>Cluster label {String.raw`$\geq 0$`}, or `-1` for anomalies/noise</span>
                    </div>
                </div>
                <pre><code className="language-python">{`from sklearn.cluster import DBSCAN                      # Instantiates Density-Based Spatial Clustering algorithm
from sklearn.preprocessing import StandardScaler            # Critically needed for stable neighborhood radii geometry
from sklearn.metrics import silhouette_score                # Clustering cohesion evaluator

scaler = StandardScaler()                                   # Create data z-score standardizer
X_scaled = scaler.fit_transform(X)                          # Apply scale distribution map

db = DBSCAN(eps=0.5, min_samples=5)                         # Epsilon defines exactly how close points must be to be neighbors; Min Samples defines how many neighbors make it a 'Core' area
labels = db.fit_predict(X_scaled)                           # Assign clusters and automatically identify outliers as completely independent points

n_clusters = len(set(labels)) - (1 if -1 in labels else 0)  # Determine exactly how many distinct islands were found (ignore noise class)
n_noise = (labels == -1).sum()                              # Count the exact quantity of points flagged globally as -1 anomalies
print(f"Clusters: {n_clusters},  Noise points: {n_noise}")  # Report overall structural overview

# Silhouette only on non-noise points
mask = labels != -1                                         # Create boolean subset of logically clustered data, stripping anomalies
if len(set(labels[mask])) > 1:                              # Ensure there is actually more than 1 single group (you cannot score monolithic blocks)
    print(f"Silhouette: {silhouette_score(X_scaled[mask], labels[mask]):.3f}") # Gauge structural separation mathematically`}</code></pre>
            </section>

            {/* HIERARCHICAL */}
            <section className="card" id="hierarchical">
                <h2 className="card-title">Hierarchical / Agglomerative Clustering</h2>
                <p className="card-subtitle">"If I have a small dataset and stakeholders want to understand exactly how the groupings merge at different granularity levels, I use Agglomerative Hierarchical clustering so I can present them with a visual Dendrogram."</p>
                <div className="badge-container">
                    <span className="badge badge-blue">Unsupervised</span>
                    <span className="badge badge-green">Dendrogram-based</span>
                </div>
                <pre><code className="language-python">{`from sklearn.cluster import AgglomerativeClustering     # Standard bottom-up hierarchical model from Scikit
from sklearn.preprocessing import StandardScaler            # Normalizer required for Euclidean distance consistency
from sklearn.metrics import silhouette_score                # Cohesion and overlapping evaluation
from scipy.cluster.hierarchy import dendrogram, linkage     # Scipy tree structure visualizer functions needed for dendrogram plotting
import matplotlib.pyplot as plt                             # Matplotlib drawing integration wrapper

scaler = StandardScaler()                                   # Build scaling configuration template
X_scaled = scaler.fit_transform(X)                          # Apply mapping against all features

# Dendrogram to visualise merge hierarchy
linked = linkage(X_scaled, method='ward')                   # Ward explicitly minimizes exact variance while continually merging sub-clusters
plt.figure(figsize=(10, 5))                                 # Configure matplotlib rendering box coordinates
dendrogram(linked, truncate_mode='lastp', p=20)             # Plot the actual tree, stopping it vertically at 20 leaves to prevent chaos
plt.title('Dendrogram'); plt.show()                         # Produce final diagram representing data agglomeration steps

# Fit with chosen number of clusters
agg = AgglomerativeClustering(n_clusters=3, linkage='ward') # We specify Ward minimization, requesting a hard cut horizontally at 3 defined clusters
labels = agg.fit_predict(X_scaled)                          # Perform hierarchical clustering on distance tree
print(f"Silhouette: {silhouette_score(X_scaled, labels):.3f}") # Assess exact structural viability of final slice configuration`}</code></pre>
            </section>

            {/* CLUSTERING COMPARISON */}
            <section className="card" id="clustering-compare">
                <h2 className="card-title">Clustering — When to Use Which</h2>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Method</th><th>Choose K?</th><th>Shape</th><th>Outliers</th><th>Best For</th></tr></thead>
                        <tbody>
                            <tr><td>K-Means</td><td>Yes</td><td>Spherical</td><td>Sensitive</td><td>Large data, equal-sized clusters</td></tr>
                            <tr><td>DBSCAN</td><td>No</td><td>Any shape</td><td>Labels as noise</td><td>Irregular clusters, outlier detection</td></tr>
                            <tr><td>Hierarchical</td><td>Optional</td><td>Any shape</td><td>Sensitive</td><td>Small data, need dendrogram</td></tr>
                        </tbody>
                    </table>
                </div>
                <div className="callout"><strong>Silhouette Score</strong><p>Ranges from -1 to 1. Higher is better. &gt;0.5 = strong clustering, 0.25–0.5 = moderate, &lt;0.25 = weak or overlapping clusters.</p></div>
            </section>

            {/* ═══════════════ PART 5 — FORMULA SHEET ═══════════════ */}
            <h3 style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '2rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--color-border)' }}>Part 5 — Formula Sheet &amp; Summary</h3>

            <section className="card" id="formula-sheet">
                <h2 className="card-title">Formula Reference Sheet</h2>

                <h3>Core Training</h3>
                <div className="math-block">{String.raw`$$\text{Total Error} = \text{Bias}^2 + \text{Variance} + \text{Noise}$$`}</div>
                <div className="math-block">{String.raw`$$\theta = \theta - \alpha \nabla L(\theta)$$`}</div>
                <div className="math-block">{String.raw`$$\text{MSE} = \frac{1}{n}\sum(y_i - \hat{y}_i)^2$$`}</div>
                <div className="math-block">{String.raw`$$\text{Log Loss} = -\frac{1}{n}\sum[y\log\hat{y} + (1-y)\log(1-\hat{y})]$$`}</div>

                <h3>Model-Specific</h3>
                <div className="math-block">{String.raw`$$\sigma(z) = \frac{1}{1+e^{-z}} \qquad \frac{d\sigma}{dz} = \hat{y}(1-\hat{y})$$`}</div>
                <div className="math-block">{String.raw`$$\theta = (X^TX)^{-1}X^Ty \quad \text{(Normal Equation)}$$`}</div>
                <div className="math-block">{String.raw`$$H = -\sum p_i \log_2(p_i) \quad \text{(Entropy)}$$`}</div>
                <div className="math-block">{String.raw`$$d(a,b) = \sqrt{\sum(a_i-b_i)^2} \quad \text{(Euclidean)}$$`}</div>
                <div className="math-block">{String.raw`$$P(C|\mathbf{x}) \propto P(C) \prod_j P(x_j|C) \quad \text{(Bayes)}$$`}</div>

                <h3>Evaluation</h3>
                <div className="math-block">{String.raw`$$R^2 = 1 - \frac{\sum(y-\hat{y})^2}{\sum(y-\bar{y})^2}$$`}</div>
                <div className="math-block">{String.raw`$$F1 = \frac{2 \times P \times R}{P + R}$$`}</div>
            </section>

            <section className="card" id="model-summary">
                <h2 className="card-title">All Models — Quick Reference</h2>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Model</th><th>Type</th><th>Boundary</th><th>Best For</th><th>Avoid When</th></tr></thead>
                        <tbody>
                            <tr><td>Linear/Ridge/Lasso</td><td>Regression</td><td>Linear</td><td>Baseline, interpretable</td><td>Non-linear patterns</td></tr>
                            <tr><td>Logistic Regression</td><td>Classification</td><td>Linear</td><td>Baseline, regulated industries</td><td>Complex patterns</td></tr>
                            <tr><td>KNN</td><td>Both</td><td>Distance</td><td>Small data, recommendations</td><td>Large datasets (slow)</td></tr>
                            <tr><td>Decision Tree</td><td>Both</td><td>Non-linear</td><td>Interpretability</td><td>Used alone (overfits)</td></tr>
                            <tr><td>Naive Bayes</td><td>Classification</td><td>Probabilistic</td><td>Text, fast baseline</td><td>Correlated features</td></tr>
                            <tr><td>Random Forest</td><td>Both</td><td>Non-linear</td><td>Robust baseline</td><td>Need interpretability</td></tr>
                            <tr><td>XGBoost</td><td>Both</td><td>Non-linear</td><td>Best tabular performance</td><td>Very small datasets</td></tr>
                            <tr><td>GradientBoosting</td><td>Both</td><td>Non-linear</td><td>High performance</td><td>Speed critical</td></tr>
                            <tr><td>SVM</td><td>Both</td><td>Max margin</td><td>High-dim, text</td><td>Large datasets (slow)</td></tr>
                            <tr><td>K-Means</td><td>Clustering</td><td>Centroid</td><td>Round clusters</td><td>Irregular shapes</td></tr>
                            <tr><td>DBSCAN</td><td>Clustering</td><td>Density</td><td>Arbitrary shapes + outliers</td><td>Varying densities</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}
