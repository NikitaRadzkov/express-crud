import * as express from 'express';
import Controller from '../../interfaces/controller.interface';
import userModel from '../users/user.model';

class ReportController implements Controller {
  path = '/report';
  router = express.Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.generateReport);
  }

  private async generateReport(req: express.Request, res: express.Response) {
    const usersByCountries = await this.user.aggregate([
      {
        $match: {
          'address.country': {
            $exist: true,
          },
        },
      },
      {
        $group: {
          _id: {
            country: '$address.country',
          },
          users: {
            $push: {
              name: '$name',
              _id: '$_id',
            },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'users._id',
          foreignField: '_id',
          as: 'users',
        },
      },
      {
        $addFields: {
          amountOfArticles: {
            $size: '$articles',
          },
        },
      },
      {
        $sort: {
          amountOfArticles: 1,
        },
      },
    ]);
    res.send({ usersByCountries });
  }
}

export default ReportController;
