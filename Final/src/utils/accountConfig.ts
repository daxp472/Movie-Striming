interface Account {
    id: number;
    cloudName: string; // Each account has a unique Cloudinary cloud name
    uploadPreset: string; // Each account has a unique upload preset
    spaceAvailable: number; // Space left for uploads
  }
  
  const accounts: Account[] = [
    { id: 1, cloudName: 'cloud1', uploadPreset: 'preset1', spaceAvailable: 100 },
    { id: 2, cloudName: 'cloud2', uploadPreset: 'preset2', spaceAvailable: 100 },
    { id: 3, cloudName: 'cloud3', uploadPreset: 'preset3', spaceAvailable: 100 },
    { id: 4, cloudName: 'cloud4', uploadPreset: 'preset4', spaceAvailable: 100 },
    { id: 5, cloudName: 'cloud5', uploadPreset: 'preset5', spaceAvailable: 100 },
  ];
  
  // To add more accounts, simply append to the accounts array like so:
  // accounts.push({ id: 6, cloudName: 'cloud6', uploadPreset: 'preset6', spaceAvailable: 100 });
  
  export default accounts;
  