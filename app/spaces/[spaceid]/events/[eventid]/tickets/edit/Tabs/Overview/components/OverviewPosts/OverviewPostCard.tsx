import * as React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { ZuButton } from 'components/core';
import { InformationIcon, PencilIcon } from 'components/icons';

const OverviewPostCard = () => {
  return (
    <Stack direction='row' spacing={3} padding={2} bgcolor='#383838' borderRadius={3}>
      <Stack direction='row' spacing={2}>
        <Box component='img' width={50} height={50} borderRadius={20} src='/drivenfast.webp' />
        <Stack>
          <Stack direction='row' spacing={1}>
            <Typography variant='subtitle2' color='white'>
              drivenfast
            </Typography>
            <InformationIcon />
          </Stack>
          <Typography variant='body1' color='white'>
            Love to hear it. We can even expose the DID Session JWT instead? 
            DIDSess/CDB will likely experience some breaking changes in the near future
          </Typography>
          <Typography variant='caption' color='white'>
            22 Hours Ago
          </Typography>
        </Stack>
      </Stack>
      <ZuButton startIcon={<PencilIcon size={6} />} sx={{backgroundColor: '#353535'}}>Edit</ZuButton>
    </Stack>
  )
}

export default OverviewPostCard;