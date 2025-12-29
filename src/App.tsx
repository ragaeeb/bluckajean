import type React from 'react';
import { Route, Switch } from 'wouter';
import { Footer } from '@/components/Footer';
import { JsonDistillerPage } from '@/components/JsonDistillerPage';
import { JsonEditor } from '@/components/JsonEditor';
import { Navigation } from '@/components/Navigation';

/**
 * Main application component with routing.
 */
const App: React.FC = () => {
    return (
        <div className="flex min-h-screen flex-col antialiased">
            <Navigation />
            <Switch>
                <Route path="/" component={JsonEditor} />
                <Route path="/distill" component={JsonDistillerPage} />
            </Switch>
            <Footer />
        </div>
    );
};

export default App;
