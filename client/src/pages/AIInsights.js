import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Psychology,
  Send,
  AutoAwesome,
  TrendingUp,
} from '@mui/icons-material';
import AIInsightCard from '../components/Cards/AIInsightCard';
import { aiAPI } from '../utils/api';

const AIInsights = () => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await aiAPI.getInsights();
      setInsights(response.data.insights);
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    const userMessage = { type: 'user', text: question };
    setChatHistory([...chatHistory, userMessage]);

    try {
      const response = await aiAPI.askQuestion(question);
      const aiMessage = { type: 'ai', text: response.data.answer };
      setChatHistory([...chatHistory, userMessage, aiMessage]);
      setQuestion('');
    } catch (error) {
      console.error('Error asking question:', error);
      const errorMessage = { 
        type: 'ai', 
        text: 'Sorry, I encountered an error processing your question. Please try again.' 
      };
      setChatHistory([...chatHistory, userMessage, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f4c75', mb: 1 }}>
          East Africa AI Insights & Predictions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI-powered climate analysis for Kenya, Tanzania, and Uganda
        </Typography>
      </Box>

      {/* Ask the Climate AI */}
      <Card 
        elevation={0} 
        sx={{ 
          mb: 4, 
          border: '2px solid #9c27b0',
          background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Psychology sx={{ color: '#9c27b0', fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Ask the East Africa Climate AI
            </Typography>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Ask me about East Africa climate, e.g., 'What is the forecast for the start of the long rains in Kenya?' or 'How is the current drought in Tanzania affecting hydropower?' or 'Compare current soil moisture in Uganda to last year.'"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAskQuestion();
              }
            }}
            sx={{ 
              mb: 2,
              backgroundColor: 'white',
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          <Button
            variant="contained"
            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
            onClick={handleAskQuestion}
            disabled={loading || !question.trim()}
            sx={{ px: 3 }}
          >
            {loading ? 'Processing...' : 'Ask Question'}
          </Button>

          {/* Chat History */}
          {chatHistory.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Conversation History
              </Typography>
              {chatHistory.map((message, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: message.type === 'user' ? '#e3f2fd' : '#f5f5f5',
                    borderLeft: `4px solid ${message.type === 'user' ? '#2196f3' : '#9c27b0'}`,
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                    {message.type === 'user' ? 'You' : 'Climate AI'}
                  </Typography>
                  <Typography variant="body2">{message.text}</Typography>
                </Paper>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Current AI Insights */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AutoAwesome sx={{ color: '#9c27b0' }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Latest AI Insights
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {insights.map((insight, index) => (
            <Grid item xs={12} md={6} key={index}>
              <AIInsightCard
                insight={insight}
                timestamp={new Date().toISOString()}
                featured={index === 0}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Predictions Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TrendingUp sx={{ color: '#0f4c75' }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Climate Predictions
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Temperature Forecast (2050)
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#f44336' }}>
                    +1.5°C
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Projected increase from current levels
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  Under the RCP 4.5 scenario (moderate emissions), global temperatures are 
                  projected to increase by approximately 1.5°C by 2050, with regional variations.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Sea Level Rise (2100)
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#2196f3' }}>
                    +0.3m
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Projected rise by end of century
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  Sea levels are projected to rise by approximately 0.3 meters by 2100 under 
                  moderate emissions scenarios, affecting coastal communities worldwide.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Arctic Ice Extent
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#00bcd4' }}>
                    -40%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Projected decline by 2050
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  Arctic sea ice extent is projected to decline by approximately 40% by 2050, 
                  with ice-free summers becoming increasingly likely.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Extreme Weather Events
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#ff9800' }}>
                    +3x
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Increase in frequency
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  Extreme weather events such as heatwaves, droughts, and intense precipitation 
                  are projected to become 3 times more frequent by mid-century.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Methodology Note */}
      <Paper elevation={0} sx={{ p: 3, backgroundColor: '#f5f7fa' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          About These Predictions
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          These predictions are based on climate models and scenarios from the IPCC 
          (Intergovernmental Panel on Climate Change). The RCP 4.5 scenario represents 
          a moderate emissions pathway. Actual outcomes will depend on global climate action 
          and policy decisions. AI analysis synthesizes data from multiple sources including 
          NASA, NOAA, and peer-reviewed climate research.
        </Typography>
      </Paper>
    </Box>
  );
};

export default AIInsights;
