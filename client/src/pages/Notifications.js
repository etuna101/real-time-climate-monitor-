import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, List, ListItem, ListItemText, Typography } from '@mui/material';
import { userAPI } from '../utils/api';

const Notifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    const resp = await userAPI.getNotifications();
    const list = resp.data || resp;
    setItems(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const onMarkRead = async (idx) => {
    await userAPI.markNotificationRead(idx);
    fetchItems();
  };

  return (
    <Box sx={{ px: 2, py: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Notifications</Typography>
      <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <CardContent>
          {loading ? (
            <Typography>Loading…</Typography>
          ) : (
            <List>
              {items.length === 0 && (
                <Typography color="text.secondary">No notifications</Typography>
              )}
              {items.map((n, idx) => (
                <ListItem key={idx} secondaryAction={!n.read && (
                  <Button size="small" onClick={() => onMarkRead(idx)}>Mark read</Button>
                )}>
                  <ListItemText
                    primary={n.title || 'Notification'}
                    secondary={(n.body || '') + ' ' + (n.createdAt ? new Date(n.createdAt).toLocaleString() : '')}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Notifications;


