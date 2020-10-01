import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import avatar from '../../../../assets/img/faces/marc.jpg';
import detailStyle from '../../../../assets/jss/nextjs-material-dashboard/views/lecturer/detailStyle';
import Card from '../../../../components/Card/Card';
import CardAvatar from '../../../../components/Card/CardAvatar';
import CardBody from '../../../../components/Card/CardBody';
import CardHeader from '../../../../components/Card/CardHeader';
import Button from '../../../../components/CustomButtons/Button';
import GridContainer from '../../../../components/Grid/GridContainer';
import GridItem from '../../../../components/Grid/GridItem';
import Table from '../../../../components/Table/Table';
import { useFindOneLecturer } from '../../../../hooks/lecturer.hook';
import withAuth from '../../../../hooks/withAuth';
import Admin from '../../../../layouts/Admin';
import { getLecturerPositionForView } from '../../../../services/lecturer-position.service';
import { formatLecturerForGetOn } from '../../../../services/lecturer.service';
import { formatUserDetailForGetOn, getFullName } from '../../../../services/user.service';

const useStyles = makeStyles(detailStyle);

function Edit() {
  const classes = useStyles();
  const router = useRouter();
  const { data, isLoading } = useFindOneLecturer(router.query.id);
  console.log(data.lecturer);
  console.log(router);

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={(e) => e.preventDefault()}>
                <img src={avatar} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h6 className={classes.cardCategory}>
                {getLecturerPositionForView(data.lecturer.position)}
              </h6>
              <h4 className={classes.cardTitle}>
                {getFullName(data.lecturer.userDetail.firstname, data.lecturer.userDetail.lastname)}
              </h4>
              <Link href={router.asPath + '/edit'}>
                <Button className={classes.button} color="primary" round>
                  <EditIcon />
                </Button>
              </Link>
              <Link href={router.asPath + '/delete'}>
                <Button className={classes.button} color="danger" round>
                  <DeleteIcon />
                </Button>
              </Link>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Thông tin giảng viên</h4>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableData={[
                  ...formatLecturerForGetOn(data.lecturer),
                  ...formatUserDetailForGetOn(data.lecturer.userDetail)
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

Edit.layout = Admin;
Edit.getInitialProps = async () => {
  return {
    title: 'Chi tiết giảng viên'
  };
};

export default withAuth(Edit);
