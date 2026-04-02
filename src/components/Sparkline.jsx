import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

/**
 * Professional Sparkline Component
 * Minimalistic and performant for use in grids/lists.
 */
const Sparkline = ({ data, color = 'var(--accent-brand)' }) => {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`grad-${color.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <YAxis domain={['auto', 'auto']} hide />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            fill={`url(#grad-${color.replace(/[^a-zA-Z0-9]/g, '')})`} 
            strokeWidth={2} 
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Sparkline;
